const { setGlobalOptions } = require('firebase-functions')
const { onCall, onRequest, HttpsError } = require('firebase-functions/v2/https')
const { initializeApp } = require('firebase-admin/app')
const { getFirestore, FieldValue } = require('firebase-admin/firestore')
const Omise = require('omise')

setGlobalOptions({ maxInstances: 10, region: 'asia-southeast1' })

initializeApp()
const db = getFirestore()

async function adjustStock(items, delta) {
    for (const item of items) {
        const productRef = db.collection('products').doc(item.productId)
        await db.runTransaction(async (tx) => {
            const snap = await tx.get(productRef)
            if (!snap.exists) return
            const variants = snap.data().variants || []
            const updated = variants.map((v) => {
                if (v.id !== item.variantId) return v
                const newStock = (v.stock ?? 0) + delta * item.quantity
                return { ...v, stock: delta < 0 ? Math.max(0, newStock) : newStock }
            })
            tx.update(productRef, { variants: updated })
        })
    }
}

// ─── Add saved card via Omise customer ───────────────────────────────────────

exports.addOmiseCard = onCall({ secrets: ['OMISE_SECRET_KEY'] }, async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Must be signed in')
    }

    const { token } = request.data
    if (!token) {
        throw new HttpsError('invalid-argument', 'token is required')
    }

    const omise = Omise({ secretKey: process.env.OMISE_SECRET_KEY })
    const userId = request.auth.uid
    const userRef = db.collection('users').doc(userId)
    const userSnap = await userRef.get()
    const { omiseCustomerId } = userSnap.data() || {}

    let customer
    if (omiseCustomerId) {
        customer = await omise.customers.update(omiseCustomerId, { card: token })
    } else {
        customer = await omise.customers.create({ card: token })
        await userRef.set({ omiseCustomerId: customer.id }, { merge: true })
    }

    const card = customer.cards.data[customer.cards.data.length - 1]

    const cardData = {
        omiseCardId: card.id,
        last4: card.last_digits,
        brand: card.brand,
        expiryMonth: card.expiration_month,
        expiryYear: card.expiration_year,
        isPrimary: false,
        createdAt: new Date(),
    }

    const cardsRef = userRef.collection('cards')
    const existing = await cardsRef.get()
    if (existing.empty) cardData.isPrimary = true

    const cardDoc = await cardsRef.add(cardData)
    return { id: cardDoc.id, ...cardData }
})

// ─── Create Omise charge (PromptPay source or saved card) ────────────────────

exports.createCharge = onCall({ secrets: ['OMISE_SECRET_KEY'] }, async (request) => {
    const OMISE_SECRET_KEY = process.env.OMISE_SECRET_KEY
    if (!OMISE_SECRET_KEY) throw new HttpsError('failed-precondition', 'OMISE_SECRET_KEY not set.')

    const { source, cardId, items, address, shippingCost, userId, returnUri } = request.data
    if (!source && !cardId) throw new HttpsError('invalid-argument', 'source or cardId is required')
    if (!items?.length) throw new HttpsError('invalid-argument', 'items is required')

    try {
        // Server-side price calculation — never trust client-supplied amounts
        let totalTHB = 0
        const validatedItems = []
        for (const item of items) {
            const productSnap = await db.collection('products').doc(item.productId).get()
            if (!productSnap.exists) throw new HttpsError('not-found', `Product ${item.productId} not found`)
            const product = productSnap.data()
            const variant = product.variants?.find((v) => v.id === item.variantId)
            if (!variant) throw new HttpsError('not-found', `Variant ${item.variantId} not found`)
            const available = variant.stock ?? 0
            if (available < item.quantity) {
                throw new HttpsError('failed-precondition', `"${item.title}" มีสินค้าเหลือเพียง ${available} ชิ้น`)
            }
            const price = variant.price ?? 0
            totalTHB += price * item.quantity
            validatedItems.push({
                id: item.key || `${item.productId}_${item.variantId}`,
                productId: item.productId,
                variantId: item.variantId,
                variantLabel: item.variantLabel || null,
                title: item.title,
                price,
                quantity: item.quantity,
                imageUrl: item.imageUrl || null,
            })
        }

        const shippingTHB = typeof shippingCost === 'number' && shippingCost > 0 ? shippingCost : 0
        const grandBaseTHB = totalTHB + shippingTHB
        // 3% surcharge for credit card payments
        const cardSurchargeTHB = cardId ? Math.round(grandBaseTHB * 0.03 * 100) / 100 : 0
        const grandTotalTHB = grandBaseTHB + cardSurchargeTHB

        const omise = Omise({ secretKey: OMISE_SECRET_KEY })

        // For card: look up Omise customer + card IDs upfront
        let omiseCustomerId = null
        let omiseCardId = null
        if (cardId) {
            const uid = userId || request.auth?.uid
            const userSnap = await db.collection('users').doc(uid).get()
            omiseCustomerId = userSnap.data()?.omiseCustomerId
            if (!omiseCustomerId) throw new HttpsError('not-found', 'บัตรเครดิตยังไม่ได้ลงทะเบียน กรุณาเพิ่มบัตรอีกครั้ง')
            const cardSnap = await db.collection('users').doc(uid).collection('cards').doc(cardId).get()
            if (!cardSnap.exists) throw new HttpsError('not-found', 'ไม่พบข้อมูลบัตร')
            omiseCardId = cardSnap.data().omiseCardId
        }

        // Write order first — card payment needs orderId for 3DS return_uri
        const orderRef = await db.collection('orders').add({
            userId: userId || null,
            customerName: address.name,
            phone: address.phone,
            address: address.fullAddress,
            note: '',
            items: validatedItems,
            subtotalPrice: totalTHB,
            shippingPrice: shippingTHB,
            cardSurcharge: cardSurchargeTHB,
            totalPrice: grandTotalTHB,
            paymentStatus: 'pending',
            parcelStatus: null,
            stockDecremented: false,
            omiseChargeId: null,
            paymentType: cardId ? 'credit_card' : 'promptpay',
            qrImage: null,
            createdAt: FieldValue.serverTimestamp(),
        })

        await adjustStock(validatedItems, -1)
        await orderRef.update({ stockDecremented: true })

        // Build charge payload
        const CHARGE_EXPIRY_SECONDS = 15 * 60
        const chargePayload = {
            amount: Math.round(grandTotalTHB * 100),
            currency: 'thb',
            description: `Goodbooch order for ${address.name}`,
            metadata: { userId: userId || request.auth?.uid },
        }

        if (source) {
            chargePayload.source = source
            chargePayload.expires_at = new Date(Date.now() + CHARGE_EXPIRY_SECONDS * 1000).toISOString()
        } else {
            chargePayload.customer = omiseCustomerId
            chargePayload.card = omiseCardId
            if (returnUri) chargePayload.return_uri = `${returnUri}?orderId=${orderRef.id}`
        }

        const charge = await omise.charges.create(chargePayload)

        // Update order with charge info
        let qrImage = null
        const updateData = { omiseChargeId: charge.id }

        if (source && charge.source?.scannable_code) {
            qrImage = charge.source.scannable_code.image.download_uri
            updateData.qrImage = qrImage
        }

        if (cardId && charge.status === 'successful') {
            updateData.paymentStatus = 'success'
            updateData.parcelStatus = 'processing'
            updateData.paidAt = FieldValue.serverTimestamp()
        }

        await orderRef.update(updateData)

        return {
            orderId: orderRef.id,
            chargeId: charge.id,
            qrImage,
            amount: grandTotalTHB,
            authorizeUri: charge.authorize_uri || null,
            paymentStatus: cardId && charge.status === 'successful' ? 'success' : 'pending',
        }
    } catch (error) {
        console.error('createCharge error:', error)
        if (error instanceof HttpsError) throw error
        throw new HttpsError('internal', 'เกิดข้อผิดพลาด กรุณาลองใหม่')
    }
})

// ─── Poll Omise and sync order status to Firestore ───────────────────────────

exports.checkPaymentStatus = onCall({ secrets: ['OMISE_SECRET_KEY'] }, async (request) => {
    const { orderId } = request.data
    const OMISE_SECRET_KEY = process.env.OMISE_SECRET_KEY
    if (!OMISE_SECRET_KEY) throw new HttpsError('failed-precondition', 'OMISE_SECRET_KEY not set.')

    try {
        const orderSnap = await db.collection('orders').doc(orderId).get()
        if (!orderSnap.exists) throw new HttpsError('not-found', 'Order not found.')
        const order = orderSnap.data()

        // Already in a final state — skip Omise API call
        if (order.paymentStatus !== 'pending') return { paymentStatus: order.paymentStatus }

        const omise = Omise({ secretKey: OMISE_SECRET_KEY })
        const charge = await omise.charges.retrieve(order.omiseChargeId)

        let newPaymentStatus = null
        if (charge.status === 'successful') newPaymentStatus = 'success'
        else if (charge.status === 'failed') {
            newPaymentStatus = charge.failure_code === 'expired_charge' ? 'expired' : 'failed'
        } else if (charge.status === 'expired') newPaymentStatus = 'expired'

        if (newPaymentStatus) {
            const updateData = {
                paymentStatus: newPaymentStatus,
                paidAt: newPaymentStatus === 'success' ? FieldValue.serverTimestamp() : null,
            }
            if (newPaymentStatus === 'success') updateData.parcelStatus = 'processing'
            if (['failed', 'expired'].includes(newPaymentStatus) && order.stockDecremented) {
                await adjustStock(order.items, +1)
                updateData.stockDecremented = false
            }
            await orderSnap.ref.update(updateData)
        }

        return { paymentStatus: newPaymentStatus || order.paymentStatus }
    } catch (error) {
        console.error('checkPaymentStatus error:', error)
        if (error instanceof HttpsError) throw error
        throw new HttpsError('internal', 'เกิดข้อผิดพลาด กรุณาลองใหม่')
    }
})

// ─── Webhook: Omise calls this when a charge completes ───────────────────────
// Register in Omise Dashboard → Settings → Webhooks

exports.omiseWebhook = onRequest({ secrets: ['OMISE_SECRET_KEY'] }, async (req, res) => {
    const event = req.body
    console.log('[webhook] received event key:', event.key)

    if (event.key !== 'charge.complete') return res.status(200).send('OK')

    const chargeId = event.data?.id
    if (!chargeId) return res.status(400).send('Missing charge id')

    console.log('[webhook] processing charge:', chargeId)

    try {
        // Always re-verify with Omise — never trust the webhook payload alone
        const omise = Omise({ secretKey: process.env.OMISE_SECRET_KEY })
        const charge = await omise.charges.retrieve(chargeId)

        console.log('[webhook] charge status:', charge.status)

        let newPaymentStatus
        if (charge.status === 'successful') newPaymentStatus = 'success'
        else if (charge.status === 'expired' || (charge.status === 'failed' && charge.failure_code === 'expired_charge')) newPaymentStatus = 'expired'
        else newPaymentStatus = 'failed'

        const snap = await db.collection('orders').where('omiseChargeId', '==', chargeId).limit(1).get()
        if (snap.empty) {
            console.warn('[webhook] no order found for chargeId:', chargeId)
        } else {
            const orderDoc = snap.docs[0]
            const orderData = orderDoc.data()
            const updateData = {
                paymentStatus: newPaymentStatus,
                paidAt: charge.status === 'successful' ? FieldValue.serverTimestamp() : null,
            }
            if (newPaymentStatus === 'success') updateData.parcelStatus = 'processing'
            if (['failed', 'expired'].includes(newPaymentStatus) && orderData.stockDecremented) {
                await adjustStock(orderData.items, +1)
                updateData.stockDecremented = false
            }
            await orderDoc.ref.update(updateData)
            console.log('[webhook] order', orderDoc.id, 'updated to:', newPaymentStatus)
        }
    } catch (err) {
        console.error('Webhook Error:', err)
        return res.status(500).send('Internal error')
    }

    res.status(200).send('OK')
})

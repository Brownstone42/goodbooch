const { setGlobalOptions } = require('firebase-functions')
const { onCall, onRequest, HttpsError } = require('firebase-functions/v2/https')
const { initializeApp } = require('firebase-admin/app')
const { getFirestore, FieldValue } = require('firebase-admin/firestore')
const Omise = require('omise')

setGlobalOptions({ maxInstances: 10, region: 'asia-southeast1' })

initializeApp()
const db = getFirestore()

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

// ─── Create Omise charge (PromptPay source or card token) ────────────────────

exports.createCharge = onCall({ secrets: ['OMISE_SECRET_KEY'] }, async (request) => {
    const OMISE_SECRET_KEY = process.env.OMISE_SECRET_KEY
    if (!OMISE_SECRET_KEY) throw new HttpsError('failed-precondition', 'OMISE_SECRET_KEY not set.')

    const { source, items, address, userId } = request.data
    if (!source) throw new HttpsError('invalid-argument', 'source is required')
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

        const omise = Omise({ secretKey: OMISE_SECRET_KEY })
        const charge = await omise.charges.create({
            amount: Math.round(totalTHB * 100),
            currency: 'thb',
            description: `Goodbooch order for ${address.name}`,
            metadata: { userId: userId || request.auth.uid },
            source,
        })

        let qrImage = null
        if (charge.source?.scannable_code) {
            qrImage = charge.source.scannable_code.image.download_uri
        }

        const orderRef = await db.collection('orders').add({
            userId: userId || null,
            customerName: address.name,
            phone: address.phone,
            address: address.fullAddress,
            note: '',
            items: validatedItems,
            totalPrice: totalTHB,
            status: 'payment_pending',
            omiseChargeId: charge.id,
            paymentType: 'promptpay',
            qrImage: qrImage || null,
            createdAt: FieldValue.serverTimestamp(),
        })

        return {
            orderId: orderRef.id,
            chargeId: charge.id,
            qrImage,
            amount: totalTHB,
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
        if (order.status !== 'payment_pending') return { status: order.status }

        const omise = Omise({ secretKey: OMISE_SECRET_KEY })
        const charge = await omise.charges.retrieve(order.omiseChargeId)

        let newStatus = 'payment_pending'
        if (charge.status === 'successful') newStatus = 'pending'
        else if (charge.status === 'failed') {
            newStatus = charge.failure_code === 'expired_charge' ? 'expired' : 'failed'
        } else if (charge.status === 'expired') newStatus = 'expired'

        if (newStatus !== 'payment_pending') {
            await orderSnap.ref.update({
                status: newStatus,
                paidAt: newStatus === 'pending' ? FieldValue.serverTimestamp() : null,
            })
        }

        return { status: newStatus }
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
    if (event.key !== 'charge.complete') return res.status(200).send('OK')

    const chargeId = event.data?.id
    if (!chargeId) return res.status(400).send('Missing charge id')

    try {
        // Always re-verify with Omise — never trust the webhook payload alone
        const omise = Omise({ secretKey: process.env.OMISE_SECRET_KEY })
        const charge = await omise.charges.retrieve(chargeId)

        let newStatus
        if (charge.status === 'successful') newStatus = 'pending'
        else if (charge.status === 'failed' && charge.failure_code === 'expired_charge') newStatus = 'expired'
        else newStatus = 'failed'

        const snap = await db.collection('orders').where('omiseChargeId', '==', chargeId).limit(1).get()
        if (!snap.empty) {
            await snap.docs[0].ref.update({
                status: newStatus,
                paidAt: charge.status === 'successful' ? FieldValue.serverTimestamp() : null,
            })
        }
    } catch (err) {
        console.error('Webhook Error:', err)
        return res.status(500).send('Internal error')
    }

    res.status(200).send('OK')
})

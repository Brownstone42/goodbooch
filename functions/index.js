const { setGlobalOptions } = require('firebase-functions')
const { onCall, HttpsError } = require('firebase-functions/v2/https')
const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const Omise = require('omise')

setGlobalOptions({ maxInstances: 10, region: 'asia-southeast1' })

initializeApp()
const db = getFirestore()

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

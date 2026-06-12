import { defineStore } from 'pinia'
import {
    collection, getDocs, doc,
    updateDoc, deleteDoc, query, orderBy, onSnapshot,
} from 'firebase/firestore'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { db, app } from '../firebase'

function fns() {
    return getFunctions(app, 'asia-southeast1')
}

function cardsRef(userId) {
    return collection(db, 'users', userId, 'cards')
}

function cardDocRef(userId, id) {
    return doc(db, 'users', userId, 'cards', id)
}

export const usePaymentStore = defineStore('payment', {
    state: () => ({
        cards: [],
        loading: false,
        error: null,
        currentOrderStatus: null,
        currentOrderCreatedAt: null,
        _unsubscribeOrder: null,
    }),
    getters: {
        primaryCard: (state) => state.cards.find((c) => c.isPrimary) ?? state.cards[0] ?? null,
    },
    actions: {
        async createQrCharge({ source, items, address, shippingCost, userId }) {
            this.loading = true
            this.error = null
            try {
                const { data } = await httpsCallable(fns(), 'createCharge')({ source, items, address, shippingCost, userId })
                return data
            } catch (e) {
                this.error = 'ไม่สามารถสร้างคำสั่งชำระเงินได้'
                throw e
            } finally {
                this.loading = false
            }
        },

        async pollOrderStatus(orderId) {
            try {
                const { data } = await httpsCallable(fns(), 'checkPaymentStatus')({ orderId })
                return data.paymentStatus
            } catch (e) {
                console.error('[payment] pollOrderStatus failed:', e)
                return null
            }
        },

        listenToOrder(orderId) {
            this.stopOrderListener()
            this.currentOrderStatus = null
            this.currentOrderCreatedAt = null
            const docRef = doc(db, 'orders', orderId)
            this._unsubscribeOrder = onSnapshot(docRef, (snap) => {
                if (!snap.exists()) return
                const data = snap.data()
                this.currentOrderStatus = data.paymentStatus
                this.currentOrderCreatedAt = data.createdAt?.toDate?.() ?? null
            })
        },

        stopOrderListener() {
            if (this._unsubscribeOrder) {
                this._unsubscribeOrder()
                this._unsubscribeOrder = null
            }
            this.currentOrderStatus = null
            this.currentOrderCreatedAt = null
        },

        async fetchCards(userId) {
            this.loading = true
            this.error = null
            try {
                const snapshot = await getDocs(
                    query(cardsRef(userId), orderBy('createdAt', 'asc'))
                )
                this.cards = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
            } catch (e) {
                this.error = 'ไม่สามารถโหลดข้อมูลบัตรได้'
            } finally {
                this.loading = false
            }
        },

        async addCard(userId, token) {
            this.loading = true
            this.error = null
            try {
                const fn = httpsCallable(fns(), 'addOmiseCard')
                const { data } = await fn({ token })
                this.cards.push({ ...data })
            } catch (e) {
                this.error = 'ไม่สามารถเพิ่มบัตรได้'
                throw e
            } finally {
                this.loading = false
            }
        },

        async deleteCard(userId, id) {
            this.loading = true
            this.error = null
            try {
                const wasPrimary = this.cards.find((c) => c.id === id)?.isPrimary ?? false
                await deleteDoc(cardDocRef(userId, id))
                this.cards = this.cards.filter((c) => c.id !== id)
                if (wasPrimary && this.cards.length > 0) {
                    await this.setPrimary(userId, this.cards[0].id)
                }
            } catch (e) {
                this.error = 'ไม่สามารถลบบัตรได้'
            } finally {
                this.loading = false
            }
        },

        async setPrimary(userId, id) {
            this.loading = true
            this.error = null
            try {
                await Promise.all(
                    this.cards.map((c) =>
                        updateDoc(cardDocRef(userId, c.id), { isPrimary: c.id === id })
                    )
                )
                this.cards.forEach((c) => (c.isPrimary = c.id === id))
            } catch (e) {
                this.error = 'ไม่สามารถตั้งค่าบัตรหลักได้'
            } finally {
                this.loading = false
            }
        },
    },
})

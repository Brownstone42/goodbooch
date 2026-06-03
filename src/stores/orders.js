import { defineStore } from 'pinia'
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, serverTimestamp, query, where } from 'firebase/firestore'
import { db } from '../firebase'
import { useProductsStore } from './products'
import { ORDER_STATUSES } from '../constants/orderStatuses'

function normalizeOrder(raw) {
    return {
        id: raw.id,
        date: raw.createdAt?.toDate?.() ?? null,
        status: raw.status,
        totalPrice: raw.totalPrice,
        userId: raw.userId,
        customer: {
            name: raw.customerName,
            phone: raw.phone,
            address: raw.address,
            addressLine: raw.address,
        },
        items: raw.items || [],
        note: raw.note,
    }
}

export const useOrdersStore = defineStore('orders', {
    state: () => ({
        orders: [],
        loading: false,
        error: null,
    }),
    actions: {
        async getOrders() {
            this.loading = true
            this.error = null
            try {
                const snapshot = await getDocs(collection(db, 'orders'))
                this.orders = snapshot.docs
                    .map((d) => ({ id: d.id, ...d.data() }))
                    .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
            } catch (e) {
                this.error = 'Failed to load orders.'
            } finally {
                this.loading = false
            }
        },
        async createOrder({ customerName, phone, address, note, items, userId, userProvider }) {
            this.loading = true
            this.error = null
            try {
                const productsStore = useProductsStore()
                await productsStore.getProducts()
                const stockErrors = []
                for (const item of items) {
                    const product = productsStore.products.find((p) => p.id === item.productId)
                    const variant = product?.variants?.find((v) => v.id === item.variantId)
                    const available = variant?.stock ?? 0
                    if (item.quantity > available) {
                        stockErrors.push(`"${item.title}${item.variantLabel ? ' (' + item.variantLabel + ')' : ''}" — only ${available} left in stock`)
                    }
                }
                if (stockErrors.length > 0) {
                    throw new Error(stockErrors.join('\n'))
                }
                await addDoc(collection(db, 'orders'), {
                    userId: userId ?? null,
                    userProvider: userProvider ?? null,
                    customerName,
                    phone,
                    address,
                    note,
                    items: items.map((item) => ({
                        id: item.key,
                        productId: item.productId,
                        variantId: item.variantId,
                        variantLabel: item.variantLabel,
                        title: item.title,
                        price: item.price,
                        quantity: item.quantity,
                        imageUrl: item.imageUrl || null,
                    })),
                    totalPrice: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
                    status: ORDER_STATUSES.PENDING,
                    createdAt: serverTimestamp(),
                })
                await Promise.all(
                    items.map((item) =>
                        productsStore.decrementVariantStock(item.productId, item.variantId, item.quantity)
                    )
                )
            } catch (e) {
                this.error = e.message
                throw e
            } finally {
                this.loading = false
            }
        },
        async updateOrderStatus(orderId, status) {
            this.loading = true
            this.error = null
            try {
                await updateDoc(doc(db, 'orders', orderId), { status })
                const order = this.orders.find((o) => o.id === orderId)
                if (order) order.status = status
            } catch (e) {
                this.error = 'Failed to update order status.'
            } finally {
                this.loading = false
            }
        },
        async getOrdersByUser(userId) {
            this.loading = true
            this.error = null
            try {
                const snapshot = await getDocs(query(collection(db, 'orders'), where('userId', '==', userId)))
                return snapshot.docs
                    .map((d) => ({ id: d.id, ...d.data() }))
                    .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
                    .map(normalizeOrder)
            } catch (e) {
                this.error = 'Failed to load orders.'
                return []
            } finally {
                this.loading = false
            }
        },
        async getOrderById(orderId) {
            this.loading = true
            this.error = null
            try {
                const snap = await getDoc(doc(db, 'orders', orderId))
                if (!snap.exists()) return null
                return normalizeOrder({ id: snap.id, ...snap.data() })
            } catch (e) {
                this.error = 'Failed to load order.'
                return null
            } finally {
                this.loading = false
            }
        },
    },
})

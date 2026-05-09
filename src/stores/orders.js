import { defineStore } from 'pinia'
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, serverTimestamp, query, where } from 'firebase/firestore'
import { db } from '../firebase'

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

import { useProductsStore } from './products'

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
                })),
                totalPrice: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
                status: 'pending',
                createdAt: serverTimestamp(),
            })
            await Promise.all(
                items.map((item) =>
                    productsStore.decrementVariantStock(item.productId, item.variantId, item.quantity)
                )
            )
        },
        async updateOrderStatus(orderId, status) {
            await updateDoc(doc(db, 'orders', orderId), { status })
            const order = this.orders.find((o) => o.id === orderId)
            if (order) order.status = status
        },
        async getOrdersByUser(userId) {
            const snapshot = await getDocs(query(collection(db, 'orders'), where('userId', '==', userId)))
            return snapshot.docs
                .map((d) => ({ id: d.id, ...d.data() }))
                .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
                .map(normalizeOrder)
        },
        async getOrderById(orderId) {
            const snap = await getDoc(doc(db, 'orders', orderId))
            if (!snap.exists()) return null
            return normalizeOrder({ id: snap.id, ...snap.data() })
        },
    },
})

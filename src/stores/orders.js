import { defineStore } from 'pinia'
import { collection, addDoc, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useCartStore } from './cart'
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
        async createOrder({ customerName, phone, address, note }) {
            const cartStore = useCartStore()
            const productsStore = useProductsStore()
            await productsStore.getProducts()
            const stockErrors = []
            for (const item of cartStore.items) {
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
                customerName,
                phone,
                address,
                note,
                items: cartStore.items.map((item) => ({
                    id: item.key,
                    productId: item.productId,
                    variantId: item.variantId,
                    variantLabel: item.variantLabel,
                    title: item.title,
                    price: item.price,
                    quantity: item.quantity,
                })),
                totalPrice: cartStore.total,
                status: 'pending',
                createdAt: serverTimestamp(),
            })
            await Promise.all(
                cartStore.items.map((item) =>
                    productsStore.decrementVariantStock(item.productId, item.variantId, item.quantity)
                )
            )
            cartStore.clearCart()
        },
        async updateOrderStatus(orderId, status) {
            await updateDoc(doc(db, 'orders', orderId), { status })
            const order = this.orders.find((o) => o.id === orderId)
            if (order) order.status = status
        },
    },
})

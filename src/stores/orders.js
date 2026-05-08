import { defineStore } from 'pinia'
import { collection, addDoc, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useCartStore } from './cart'

export const useOrdersStore = defineStore('orders', {
    state: () => ({
        orders: [],
    }),
    actions: {
        async getOrders() {
            const snapshot = await getDocs(collection(db, 'orders'))
            this.orders = snapshot.docs
                .map((d) => ({ id: d.id, ...d.data() }))
                .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
        },
        async createOrder({ customerName, phone, address, note }) {
            const cartStore = useCartStore()
            await addDoc(collection(db, 'orders'), {
                customerName,
                phone,
                address,
                note,
                items: cartStore.items.map((item) => ({
                    id: item.id,
                    title: item.title,
                    price: item.price,
                    quantity: item.quantity,
                })),
                totalPrice: cartStore.total,
                status: 'pending',
                createdAt: serverTimestamp(),
            })
            cartStore.clearCart()
        },
        async updateOrderStatus(orderId, status) {
            await updateDoc(doc(db, 'orders', orderId), { status })
            const order = this.orders.find((o) => o.id === orderId)
            if (order) order.status = status
        },
    },
})

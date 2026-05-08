import { defineStore } from 'pinia'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useCartStore } from './cart'

export const useOrdersStore = defineStore('orders', {
    actions: {
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
    },
})

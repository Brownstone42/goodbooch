import { defineStore } from 'pinia'
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

export const useProductsStore = defineStore('products', {
    state: () => ({
        products: [],
    }),
    getters: {
        getById: (state) => (id) => state.products.find((p) => p.id === id),
    },
    actions: {
        async getProducts() {
            const snapshot = await getDocs(collection(db, 'products'))
            this.products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        },
        async createProduct({ title, description, price, isActive }) {
            await addDoc(collection(db, 'products'), {
                title,
                description,
                price,
                isActive,
                createdAt: serverTimestamp(),
            })
            await this.getProducts()
        },
    },
})

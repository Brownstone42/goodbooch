import { defineStore } from 'pinia'
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../firebase'

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
            this.products = await Promise.all(
                snapshot.docs.map(async (doc) => {
                    const data = { id: doc.id, ...doc.data() }
                    if (data.imagePath) {
                        data.imageUrl = await getDownloadURL(storageRef(storage, data.imagePath))
                    }
                    return data
                })
            )
        },
        async createProduct({ title, description, price, isActive, imagePath = null }) {
            await addDoc(collection(db, 'products'), {
                title,
                description,
                price,
                isActive,
                imagePath,
                createdAt: serverTimestamp(),
            })
            await this.getProducts()
        },
        async updateProduct(id, { title, description, price, isActive, imagePath }) {
            await updateDoc(doc(db, 'products', id), { title, description, price, isActive, imagePath })
            await this.getProducts()
        },
        async deleteProduct(id) {
            await deleteDoc(doc(db, 'products', id))
            this.products = this.products.filter((p) => p.id !== id)
        },
        async uploadProductImage(file) {
            const path = `products/${Date.now()}-${file.name}`
            await uploadBytes(storageRef(storage, path), file)
            return path
        },
    },
})

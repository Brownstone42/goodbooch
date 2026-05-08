import { defineStore } from 'pinia'
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../firebase'

export const useProductsStore = defineStore('products', {
    state: () => ({
        products: [],
        loading: false,
        error: null,
    }),
    getters: {
        getById: (state) => (id) => state.products.find((p) => p.id === id),
    },
    actions: {
        async getProducts() {
            this.loading = true
            this.error = null
            try {
                const snapshot = await getDocs(collection(db, 'products'))
                this.products = await Promise.all(
                    snapshot.docs.map(async (docSnap) => {
                        const data = { id: docSnap.id, ...docSnap.data() }
                        const coverPath = data.coverImagePath || data.imagePath
                        if (coverPath) {
                            data.coverImageUrl = await getDownloadURL(storageRef(storage, coverPath))
                        }
                        if (!data.variants || data.variants.length === 0) {
                            data.variants = [{ id: 'default', optionValues: [], price: data.price ?? 0, stock: 0, imagePath: null }]
                            data.optionGroups = data.optionGroups || []
                        }
                        data.variants = await Promise.all(
                            data.variants.map(async (v) => {
                                if (v.imagePath) {
                                    v.imageUrl = await getDownloadURL(storageRef(storage, v.imagePath))
                                }
                                return v
                            })
                        )
                        data.displayPrice = data.variants[0].price
                        data.imageUrl = data.coverImageUrl || data.variants.find((v) => v.imageUrl)?.imageUrl || null
                        return data
                    })
                )
            } catch (e) {
                this.error = 'Failed to load products.'
            } finally {
                this.loading = false
            }
        },
        async createProduct({ title, description, isActive, coverImagePath = null, optionGroups = [], variants = [] }) {
            await addDoc(collection(db, 'products'), {
                title,
                description,
                isActive,
                coverImagePath,
                optionGroups,
                variants: variants.map(({ id, optionValues, price, stock, imagePath }) => ({
                    id,
                    optionValues,
                    price,
                    stock,
                    imagePath: imagePath || null,
                })),
                createdAt: serverTimestamp(),
            })
            await this.getProducts()
        },
        async updateProduct(id, { title, description, isActive, coverImagePath, optionGroups = [], variants = [] }) {
            await updateDoc(doc(db, 'products', id), {
                title,
                description,
                isActive,
                coverImagePath: coverImagePath || null,
                optionGroups,
                variants: variants.map(({ id: vid, optionValues, price, stock, imagePath }) => ({
                    id: vid,
                    optionValues,
                    price,
                    stock,
                    imagePath: imagePath || null,
                })),
            })
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

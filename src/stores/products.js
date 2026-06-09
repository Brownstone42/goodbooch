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
                            try { data.coverImageUrl = await getDownloadURL(storageRef(storage, coverPath)) }
                            catch { data.coverImageUrl = null }
                        }
                        if (data.detailImagePaths && data.detailImagePaths.length > 0) {
                            const urls = await Promise.all(
                                data.detailImagePaths.map(async (p) => {
                                    try { return await getDownloadURL(storageRef(storage, p)) }
                                    catch { return null }
                                })
                            )
                            data.detailImageUrls = urls.filter(Boolean)
                        } else {
                            data.detailImageUrls = []
                        }
                        if (!data.variants || data.variants.length === 0) {
                            data.variants = [{ id: 'default', optionValues: [], price: data.price ?? 0, stock: 0, imagePath: null }]
                            data.optionGroups = data.optionGroups || []
                        }
                        data.variants = await Promise.all(
                            data.variants.map(async (v) => {
                                if (v.imagePath) {
                                    try { v.imageUrl = await getDownloadURL(storageRef(storage, v.imagePath)) }
                                    catch { v.imageUrl = null }
                                }
                                return v
                            })
                        )
                        data.displayPrice = data.variants[0].price
                        data.imageUrl = data.coverImageUrl || data.variants.find((v) => v.imageUrl)?.imageUrl || null
                        data.categories = Array.isArray(data.categories) ? data.categories : (data.category ? [data.category] : [])
                        data.category = data.categories[0] || ''
                        return data
                    })
                )
            } catch (e) {
                console.error('[products] getProducts failed:', e)
                this.error = 'Failed to load products.'
            } finally {
                this.loading = false
            }
        },
        async createProduct({ title, description, category = '', categories = [], isActive, coverImagePath = null, detailImagePaths = [], optionGroups = [], variants = [] }) {
            const productCategories = Array.isArray(categories) ? categories : (category ? [category] : [])
            await addDoc(collection(db, 'products'), {
                title,
                description,
                category: productCategories[0] || '',
                categories: productCategories,
                isActive,
                coverImagePath,
                detailImagePaths,
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
        async updateProduct(id, { title, description, category = '', categories = [], isActive, coverImagePath, detailImagePaths = [], optionGroups = [], variants = [] }) {
            const productCategories = Array.isArray(categories) ? categories : (category ? [category] : [])
            await updateDoc(doc(db, 'products', id), {
                title,
                description,
                category: productCategories[0] || '',
                categories: productCategories,
                isActive,
                coverImagePath: coverImagePath || null,
                detailImagePaths,
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
        async decrementVariantStock(productId, variantId, quantity) {
            const product = this.products.find((p) => p.id === productId)
            if (!product) return
            const updatedVariants = product.variants.map((v) =>
                v.id === variantId ? { ...v, stock: Math.max(0, (v.stock ?? 0) - quantity) } : v
            )
            await updateDoc(doc(db, 'products', productId), {
                variants: updatedVariants.map(({ id, optionValues, price, stock, imagePath }) => ({
                    id,
                    optionValues,
                    price,
                    stock,
                    imagePath: imagePath || null,
                })),
            })
            product.variants = updatedVariants
        },
        async uploadProductImage(file) {
            const path = `products/${Date.now()}-${file.name}`
            await uploadBytes(storageRef(storage, path), file)
            return path
        },
    },
})

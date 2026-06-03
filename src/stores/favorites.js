import { defineStore } from 'pinia'
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { db } from '../firebase'

export const useFavoritesStore = defineStore('favorites', {
    state: () => ({
        productIds: [],
        loading: false,
        error: null,
    }),
    getters: {
        isFavorite: (state) => (productId) => state.productIds.includes(productId),
    },
    actions: {
        async fetchFavorites(userId) {
            this.loading = true
            this.error = null
            try {
                const snap = await getDoc(doc(db, 'favorites', userId))
                this.productIds = snap.exists() ? (snap.data().productIds ?? []) : []
            } catch (e) {
                this.error = 'Failed to load favorites.'
            } finally {
                this.loading = false
            }
        },
        async toggleFavorite(userId, productId) {
            const isFav = this.productIds.includes(productId)
            if (isFav) {
                this.productIds = this.productIds.filter((id) => id !== productId)
                try {
                    await setDoc(doc(db, 'favorites', userId), { productIds: arrayRemove(productId) }, { merge: true })
                } catch {
                    this.productIds.push(productId)
                }
            } else {
                this.productIds.push(productId)
                try {
                    await setDoc(doc(db, 'favorites', userId), { productIds: arrayUnion(productId) }, { merge: true })
                } catch {
                    this.productIds = this.productIds.filter((id) => id !== productId)
                }
            }
        },
    },
})

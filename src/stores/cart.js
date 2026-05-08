import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [],
    }),
    getters: {
        total: (state) => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        itemCount: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    },
    actions: {
        addItem({ key, productId, variantId, variantLabel, title, price, imageUrl, stock }) {
            const existing = this.items.find((item) => item.key === key)
            if (existing) {
                if (stock !== undefined && existing.quantity >= stock) return
                existing.quantity++
            } else {
                if (stock === 0) return
                this.items.push({ key, productId, variantId, variantLabel, title, price, imageUrl, stock, quantity: 1 })
            }
        },
        removeItem(key) {
            this.items = this.items.filter((item) => item.key !== key)
        },
        decrementItem(key) {
            const item = this.items.find((item) => item.key === key)
            if (item && item.quantity > 1) {
                item.quantity--
            } else {
                this.removeItem(key)
            }
        },
        clearCart() {
            this.items = []
        },
    },
})

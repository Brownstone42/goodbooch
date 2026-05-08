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
        addItem({ key, productId, variantId, variantLabel, title, price, imageUrl }) {
            const existing = this.items.find((item) => item.key === key)
            if (existing) {
                existing.quantity++
            } else {
                this.items.push({ key, productId, variantId, variantLabel, title, price, imageUrl, quantity: 1 })
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

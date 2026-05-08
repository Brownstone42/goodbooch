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
        addItem(product) {
            const existing = this.items.find((item) => item.id === product.id)
            if (existing) {
                existing.quantity++
            } else {
                this.items.push({ ...product, quantity: 1 })
            }
        },
        removeItem(productId) {
            this.items = this.items.filter((item) => item.id !== productId)
        },
        decrementItem(productId) {
            const item = this.items.find((item) => item.id === productId)
            if (item && item.quantity > 1) {
                item.quantity--
            } else {
                this.removeItem(productId)
            }
        },
    },
})

import { defineStore } from 'pinia'

const STORAGE_KEY = 'goodbooch_cart'

function loadCart() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
    } catch {
        return []
    }
}

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: loadCart(),
    }),
    getters: {
        total: (state) => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        itemCount: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    },
    actions: {
        _persist() {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items))
        },
        addItem({ key, productId, variantId, variantLabel, title, price, imageUrl, stock }) {
            const existing = this.items.find((item) => item.key === key)
            if (existing) {
                if (stock !== undefined && existing.quantity >= stock) return
                existing.quantity++
            } else {
                if (stock === 0) return
                this.items.push({ key, productId, variantId, variantLabel, title, price, imageUrl, stock, quantity: 1 })
            }
            this._persist()
        },
        removeItem(key) {
            this.items = this.items.filter((item) => item.key !== key)
            this._persist()
        },
        decrementItem(key) {
            const item = this.items.find((item) => item.key === key)
            if (item && item.quantity > 1) {
                item.quantity--
            } else {
                this.removeItem(key)
                return
            }
            this._persist()
        },
        clearCart() {
            this.items = []
            this._persist()
        },
    },
})

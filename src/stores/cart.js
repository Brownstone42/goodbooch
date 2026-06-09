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
        itemCount: (state) => state.items.length,
    },
    actions: {
        _persist() {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items))
        },
        addItem({ key, productId, variantId, variantLabel, title, price, imageUrl, stock }, quantity = 1) {
            const existing = this.items.find((item) => item.key === key)
            if (existing) {
                const maxAdd = stock !== undefined ? Math.min(quantity, stock - existing.quantity) : quantity
                if (maxAdd <= 0) return
                existing.quantity += maxAdd
            } else {
                if (stock === 0) return
                const qty = stock !== undefined ? Math.min(quantity, stock) : quantity
                this.items.push({ key, productId, variantId, variantLabel, title, price, imageUrl, stock, quantity: qty })
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
        reorderItems(items) {
            this.items = items.map((item) => ({
                key: item.key || `${item.productId}_${item.variantId}`,
                productId: item.productId,
                variantId: item.variantId,
                variantLabel: item.variantLabel || null,
                title: item.title,
                price: item.price,
                imageUrl: item.imageUrl || '/images/mask.png',
                stock: item.stock,
                quantity: item.quantity,
            }))
            this._persist()
        },
        clearCart() {
            this.items = []
            this._persist()
        },
    },
})

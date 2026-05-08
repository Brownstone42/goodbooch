import { defineStore } from 'pinia'

export const useProductsStore = defineStore('products', {
    state: () => ({
        list: [
            { id: 1, name: 'Classic T-Shirt', price: 29.99, description: 'A comfortable everyday t-shirt.' },
            { id: 2, name: 'Slim Jeans', price: 59.99, description: 'Modern slim-fit jeans.' },
            { id: 3, name: 'Sneakers', price: 89.99, description: 'Lightweight everyday sneakers.' },
            { id: 4, name: 'Hoodie', price: 49.99, description: 'Cozy pullover hoodie.' },
        ],
    }),
    getters: {
        getById: (state) => (id) => state.list.find((p) => p.id === Number(id)),
    },
})

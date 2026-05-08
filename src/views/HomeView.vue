<template>
    <div class="p-4">
        <h1 class="text-2xl font-bold mb-4">Shop</h1>
        <div class="grid grid-cols-2 gap-3">
            <div
                v-for="product in products"
                :key="product.id"
                class="bg-white rounded-xl shadow-sm overflow-hidden"
            >
                <router-link :to="'/product/' + product.id">
                    <div
                        class="w-full aspect-square bg-gray-100 flex items-center justify-center text-gray-300 text-xs"
                    >
                        No image
                    </div>
                    <div class="p-3">
                        <p class="font-medium text-sm leading-tight">{{ product.name }}</p>
                        <p class="text-gray-500 text-sm mt-0.5">${{ product.price.toFixed(2) }}</p>
                    </div>
                </router-link>
                <div class="px-3 pb-3">
                    <button
                        @click="addToCart(product)"
                        class="w-full bg-black text-white text-sm py-2 rounded-lg"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useProductsStore } from '../stores/products'
import { useCartStore } from '../stores/cart'

export default {
    computed: {
        products() {
            return useProductsStore().list
        },
    },
    methods: {
        addToCart(product) {
            useCartStore().addItem(product)
        },
    },
}
</script>

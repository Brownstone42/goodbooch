<template>
    <div>
        <div class="p-4">
            <router-link to="/" class="text-gray-500 text-sm">← Back</router-link>
        </div>
        <div v-if="product">
            <img
                :src="product.imageUrl || '/images/mask.png'"
                :alt="product.title"
                class="w-full aspect-square object-cover"
            />
            <div class="p-4">
                <h1 class="text-2xl font-bold">{{ product.title }}</h1>
                <p class="text-xl text-gray-600 mt-1">${{ product.price.toFixed(2) }}</p>
                <p class="text-gray-500 mt-3 leading-relaxed">{{ product.description }}</p>
                <button
                    @click="addToCart"
                    class="mt-6 w-full bg-black text-white py-3.5 rounded-xl text-base font-medium"
                >
                    Add to Cart
                </button>
            </div>
        </div>
        <div v-else class="p-8 text-center text-gray-400">Product not found.</div>
    </div>
</template>

<script>
import { useProductsStore } from '../stores/products'
import { useCartStore } from '../stores/cart'

export default {
    mounted() {
        if (useProductsStore().products.length === 0) {
            useProductsStore().getProducts()
        }
    },
    computed: {
        product() {
            return useProductsStore().getById(this.$route.params.id)
        },
    },
    methods: {
        addToCart() {
            useCartStore().addItem(this.product)
            this.$router.push('/cart')
        },
    },
}
</script>

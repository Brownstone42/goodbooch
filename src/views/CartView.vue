<template>
    <div class="p-4">
        <div class="flex items-center gap-3 mb-4">
            <button
                @click="$router.back()"
                class="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center shrink-0"
                aria-label="Back"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <h1 class="text-2xl font-bold flex-1">Cart</h1>
            <button
                v-if="items.length > 0"
                @click="clearCart"
                class="text-sm text-red-400 hover:text-red-600 transition-colors"
            >
                Clear all
            </button>
        </div>

        <div v-if="items.length === 0" class="flex flex-col items-center justify-center mt-20 text-gray-400">
            <p class="text-lg">Your cart is empty</p>
            <router-link to="/" class="mt-4 text-black underline text-sm">Continue Shopping</router-link>
        </div>

        <div v-else>
            <div
                v-for="item in items"
                :key="item.key"
                class="flex items-center gap-3 py-4 border-b border-gray-100"
            >
                <img
                    :src="item.imageUrl || '/images/mask.png'"
                    :alt="item.title"
                    class="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
                <div class="flex-1 min-w-0">
                    <p class="font-medium text-sm truncate">{{ item.title }}</p>
                    <p v-if="item.variantLabel" class="text-gray-400 text-xs mt-0.5">{{ item.variantLabel }}</p>
                    <p class="text-gray-500 text-sm">฿{{ item.price.toFixed(2) }}</p>
                    <div class="flex items-center gap-2 mt-1.5">
                        <button
                            @click="decrement(item.key)"
                            class="w-7 h-7 bg-gray-100 rounded-full text-base leading-none"
                        >
                            −
                        </button>
                        <span class="text-sm w-4 text-center">{{ item.quantity }}</span>
                        <button
                            @click="increment(item)"
                            :disabled="item.stock !== undefined && item.quantity >= item.stock"
                            class="w-7 h-7 bg-gray-100 rounded-full text-base leading-none disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            +
                        </button>
                    </div>
                </div>
                <div class="flex flex-col items-end gap-2 flex-shrink-0">
                    <button
                        @click="removeItem(item.key)"
                        class="text-gray-300 hover:text-red-400 transition-colors"
                        aria-label="Remove item"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                    <p class="font-semibold text-sm">฿{{ (item.price * item.quantity).toFixed(2) }}</p>
                </div>
            </div>

            <div class="mt-6 flex justify-between items-center">
                <span class="text-lg font-bold">Total</span>
                <span class="text-lg font-bold">฿{{ total.toFixed(2) }}</span>
            </div>

            <button
                @click="$router.push('/checkout')"
                class="mt-4 w-full bg-black text-white py-3.5 rounded-xl text-base font-medium"
            >
                Checkout
            </button>
        </div>
    </div>
</template>

<script>
import { useCartStore } from '../stores/cart'

export default {
    computed: {
        items() {
            return useCartStore().items
        },
        total() {
            return useCartStore().total
        },
    },
    methods: {
        increment(item) {
            useCartStore().addItem(item)
        },
        decrement(key) {
            useCartStore().decrementItem(key)
        },
        removeItem(key) {
            useCartStore().removeItem(key)
        },
        clearCart() {
            useCartStore().clearCart()
        },
    },
}
</script>

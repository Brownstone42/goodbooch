<template>
    <div class="p-4">
        <h1 class="text-2xl font-bold mb-4">Cart</h1>

        <div v-if="items.length === 0" class="flex flex-col items-center justify-center mt-20 text-gray-400">
            <p class="text-lg">Your cart is empty</p>
            <router-link to="/" class="mt-4 text-black underline text-sm">Continue Shopping</router-link>
        </div>

        <div v-else>
            <div
                v-for="item in items"
                :key="item.id"
                class="flex items-center gap-3 py-4 border-b border-gray-100"
            >
                <img
                    :src="item.imageUrl || '/images/mask.png'"
                    :alt="item.title"
                    class="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
                <div class="flex-1 min-w-0">
                    <p class="font-medium text-sm truncate">{{ item.title }}</p>
                    <p class="text-gray-500 text-sm">฿{{ item.price.toFixed(2) }}</p>
                    <div class="flex items-center gap-2 mt-1.5">
                        <button
                            @click="decrement(item.id)"
                            class="w-7 h-7 bg-gray-100 rounded-full text-base leading-none"
                        >
                            −
                        </button>
                        <span class="text-sm w-4 text-center">{{ item.quantity }}</span>
                        <button
                            @click="increment(item)"
                            class="w-7 h-7 bg-gray-100 rounded-full text-base leading-none"
                        >
                            +
                        </button>
                    </div>
                </div>
                <p class="font-semibold text-sm">฿{{ (item.price * item.quantity).toFixed(2) }}</p>
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
        decrement(id) {
            useCartStore().decrementItem(id)
        },
    },
}
</script>

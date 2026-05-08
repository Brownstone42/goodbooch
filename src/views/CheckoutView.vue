<template>
    <div class="p-4 max-w-lg mx-auto">
        <div class="mb-4">
            <router-link to="/cart" class="text-gray-500 text-sm">← Back to Cart</router-link>
        </div>

        <div v-if="ordered" class="flex flex-col items-center justify-center mt-20 text-center">
            <div class="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <p class="text-xl font-bold">Order placed!</p>
            <p class="text-gray-500 text-sm mt-1">We'll be in touch soon.</p>
            <router-link to="/" class="mt-6 text-black underline text-sm">Continue Shopping</router-link>
        </div>

        <div v-else>
            <h1 class="text-2xl font-bold mb-6">Checkout</h1>

            <div class="bg-gray-50 rounded-xl p-4 mb-6">
                <p class="text-sm font-semibold text-gray-700 mb-3">Order Summary</p>
                <div v-for="item in items" :key="item.key" class="flex justify-between text-sm py-1">
                    <span class="text-gray-600">{{ item.title }}{{ item.variantLabel ? ' (' + item.variantLabel + ')' : '' }} × {{ item.quantity }}</span>
                    <span class="font-medium">฿{{ (item.price * item.quantity).toFixed(2) }}</span>
                </div>
                <div class="flex justify-between font-bold mt-3 pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span>฿{{ total.toFixed(2) }}</span>
                </div>
            </div>

            <form @submit.prevent="submitOrder" class="space-y-4">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">Name</label>
                    <input
                        v-model="form.customerName"
                        type="text"
                        required
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Full name"
                    />
                </div>

                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
                    <input
                        v-model="form.phone"
                        type="tel"
                        required
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Phone number"
                    />
                </div>

                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">Address</label>
                    <textarea
                        v-model="form.address"
                        rows="3"
                        required
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                        placeholder="Delivery address"
                    ></textarea>
                </div>

                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">Note <span class="font-normal text-gray-400">(optional)</span></label>
                    <textarea
                        v-model="form.note"
                        rows="2"
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                        placeholder="Any special instructions"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    :disabled="loading"
                    class="w-full bg-black text-white py-3.5 rounded-xl text-base font-medium disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                    {{ loading ? 'Placing Order...' : 'Place Order' }}
                </button>
            </form>
        </div>
    </div>
</template>

<script>
import { useCartStore } from '../stores/cart'
import { useOrdersStore } from '../stores/orders'

export default {
    data() {
        return {
            ordered: false,
            loading: false,
            form: {
                customerName: '',
                phone: '',
                address: '',
                note: '',
            },
        }
    },
    computed: {
        items() {
            return useCartStore().items
        },
        total() {
            return useCartStore().total
        },
    },
    methods: {
        async submitOrder() {
            this.loading = true
            await useOrdersStore().createOrder(this.form)
            this.loading = false
            this.ordered = true
        },
    },
}
</script>

<template>
    <div class="p-4 max-w-lg mx-auto">
        <div class="mb-4">
            <button @click="$router.back()" class="text-gray-500 text-sm">← Back</button>
        </div>

        <div v-if="ordered" class="flex flex-col items-center justify-center mt-20 text-center">
            <div class="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <p class="text-xl font-bold">Order placed!</p>
            <p class="text-gray-500 text-sm mt-1">We'll be in touch soon.</p>

            <div v-if="orderSummary" class="mt-6 bg-gray-50 rounded-xl p-4 w-full text-left text-sm">
                <div class="flex justify-between py-1.5">
                    <span class="text-gray-500">Name</span>
                    <span class="font-medium">{{ orderSummary.customerName }}</span>
                </div>
                <div class="flex justify-between py-1.5">
                    <span class="text-gray-500">Phone</span>
                    <span class="font-medium">{{ orderSummary.phone }}</span>
                </div>
                <div class="flex justify-between py-1.5">
                    <span class="text-gray-500">Items</span>
                    <span class="font-medium">{{ orderSummary.itemCount }} item{{ orderSummary.itemCount === 1 ? '' : 's' }}</span>
                </div>
                <div class="flex justify-between py-1.5 border-t border-gray-200 mt-1 pt-2.5">
                    <span class="font-semibold">Total</span>
                    <span class="font-bold">฿{{ orderSummary.total.toFixed(2) }}</span>
                </div>
            </div>

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

            <div v-if="stockError" class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4 whitespace-pre-line">{{ stockError }}</div>

            <form @submit.prevent="submitOrder" class="space-y-4">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">Name</label>
                    <input
                        v-model="form.customerName"
                        type="text"
                        class="w-full px-4 py-3 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        :class="errors.customerName ? 'border-red-400' : 'border-gray-200'"
                        placeholder="Full name"
                    />
                    <p v-if="errors.customerName" class="text-red-500 text-xs mt-1">{{ errors.customerName }}</p>
                </div>

                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
                    <input
                        v-model="form.phone"
                        type="tel"
                        class="w-full px-4 py-3 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        :class="errors.phone ? 'border-red-400' : 'border-gray-200'"
                        placeholder="Phone number"
                    />
                    <p v-if="errors.phone" class="text-red-500 text-xs mt-1">{{ errors.phone }}</p>
                </div>

                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">Address</label>
                    <textarea
                        v-model="form.address"
                        rows="3"
                        class="w-full px-4 py-3 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                        :class="errors.address ? 'border-red-400' : 'border-gray-200'"
                        placeholder="Delivery address"
                    ></textarea>
                    <p v-if="errors.address" class="text-red-500 text-xs mt-1">{{ errors.address }}</p>
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
import { useAuthStore } from '../stores/auth'

export default {
    data() {
        return {
            ordered: false,
            loading: false,
            stockError: null,
            orderSummary: null,
            errors: { customerName: '', phone: '', address: '' },
            form: {
                customerName: '',
                phone: '',
                address: '',
                note: '',
            },
        }
    },
    mounted() {
        const auth = useAuthStore()
        if (!auth.isAuthenticated) {
            this.$router.replace('/login?redirect=/checkout')
            return
        }
        this.form.customerName = auth.user.name
        this.form.phone = auth.user.phone || ''
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
        validate() {
            const e = { customerName: '', phone: '', address: '' }
            let valid = true
            if (!this.form.customerName.trim()) {
                e.customerName = 'Name is required.'
                valid = false
            }
            const digits = this.form.phone.replace(/\D/g, '')
            if (!this.form.phone.trim()) {
                e.phone = 'Phone number is required.'
                valid = false
            } else if (digits.length < 9) {
                e.phone = 'Enter a valid phone number.'
                valid = false
            }
            if (!this.form.address.trim()) {
                e.address = 'Address is required.'
                valid = false
            }
            this.errors = e
            return valid
        },
        async submitOrder() {
            if (!this.validate()) return
            this.loading = true
            this.stockError = null
            try {
                const snapshot = {
                    customerName: this.form.customerName,
                    phone: this.form.phone,
                    total: this.total,
                    itemCount: this.items.reduce((sum, i) => sum + i.quantity, 0),
                }
                await useOrdersStore().createOrder({
                    ...this.form,
                    items: this.items,
                    userId: useAuthStore().user?.id ?? null,
                    userProvider: useAuthStore().user?.provider ?? null,
                })
                useCartStore().clearCart()
                this.orderSummary = snapshot
                this.ordered = true
            } catch (e) {
                this.stockError = e.message
            }
            this.loading = false
        },
    },
}
</script>

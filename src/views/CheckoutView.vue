<template>
    <div class="p-4 max-w-lg mx-auto">
        <div class="mb-4">
            <button @click="$router.back()" class="text-gray-500 text-sm">← Back</button>
        </div>

        <!-- Order placed confirmation -->
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

        <!-- Checkout form -->
        <div v-else>
            <h1 class="text-2xl font-bold mb-6">Checkout</h1>

            <!-- Order summary -->
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

                <!-- Address selector -->
                <div>
                    <div class="flex items-center justify-between mb-2">
                        <label class="text-sm font-semibold text-gray-700">ที่อยู่จัดส่ง</label>
                        <router-link to="/profile/address" class="text-xs text-brand font-medium">จัดการที่อยู่</router-link>
                    </div>

                    <!-- Has saved addresses -->
                    <div v-if="addresses.length > 0" class="flex flex-col gap-2">
                        <label
                            v-for="addr in addresses"
                            :key="addr.id"
                            class="flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors"
                            :class="selectedAddressId === addr.id
                                ? 'border-brand bg-brand/5'
                                : 'border-gray-200 bg-white'"
                        >
                            <input
                                type="radio"
                                :value="addr.id"
                                v-model="selectedAddressId"
                                class="mt-0.5 accent-brand shrink-0"
                            />
                            <div class="min-w-0">
                                <div class="flex items-center gap-2">
                                    <span class="text-sm font-semibold text-gray-800">{{ addr.name }}</span>
                                    <span v-if="addr.isPrimary" class="text-[10px] font-semibold text-white bg-brand px-1.5 py-0.5 rounded-full">หลัก</span>
                                </div>
                                <p class="text-xs text-gray-500 mt-0.5 leading-relaxed">{{ fullAddress(addr) }}</p>
                                <p class="text-xs text-gray-500">{{ addr.phone }}</p>
                            </div>
                        </label>
                    </div>

                    <!-- No saved addresses -->
                    <div v-else class="border border-dashed border-gray-300 rounded-xl p-4 text-center">
                        <p class="text-sm text-gray-400 mb-2">ยังไม่มีที่อยู่ที่บันทึกไว้</p>
                        <router-link to="/profile/address/new" class="text-sm text-brand font-medium">+ เพิ่มที่อยู่</router-link>
                    </div>

                    <p v-if="errors.address" class="text-red-500 text-xs mt-1">{{ errors.address }}</p>
                </div>

                <!-- Note -->
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
import { useAddressStore } from '../stores/address'

export default {
    data() {
        return {
            ordered: false,
            loading: false,
            stockError: null,
            orderSummary: null,
            selectedAddressId: null,
            errors: { address: '' },
            form: {
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
        const addressStore = useAddressStore()
        const initAddresses = () => {
            const primary = addressStore.primaryAddress
            if (primary) this.selectedAddressId = primary.id
        }
        if (addressStore.addresses.length > 0) {
            initAddresses()
        } else {
            addressStore.fetchAddresses(auth.user.id).then(initAddresses)
        }
    },
    computed: {
        items()     { return useCartStore().items },
        total()     { return useCartStore().total },
        addresses() { return useAddressStore().addresses },
        selectedAddress() {
            return this.addresses.find((a) => a.id === this.selectedAddressId) ?? null
        },
    },
    methods: {
        fullAddress(addr) {
            if (addr.detail) {
                return [addr.detail, addr.subdistrict, addr.district, addr.province, addr.postalCode]
                    .filter(Boolean).join(' ')
            }
            return addr.address || ''
        },
        validate() {
            const e = { address: '' }
            let valid = true
            if (!this.selectedAddress) {
                e.address = 'กรุณาเลือกที่อยู่จัดส่ง'
                valid = false
            }
            this.errors = e
            return valid
        },
        async submitOrder() {
            if (!this.validate()) return
            this.loading = true
            this.stockError = null
            const addr = this.selectedAddress
            try {
                const snapshot = {
                    customerName: addr.name,
                    phone: addr.phone,
                    total: this.total,
                    itemCount: this.items.reduce((sum, i) => sum + i.quantity, 0),
                }
                await useOrdersStore().createOrder({
                    customerName: addr.name,
                    phone:        addr.phone,
                    address:      this.fullAddress(addr),
                    note:         this.form.note,
                    items:        this.items,
                    userId:       useAuthStore().user?.id ?? null,
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

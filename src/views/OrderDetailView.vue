<template>
    <div class="bg-[#f8f9fa] min-h-screen pb-10">
        <!-- Header -->
        <header class="bg-white px-4 py-4 flex items-center sticky top-0 z-50 shadow-sm border-b border-gray-100">
            <button @click="$router.back()" class="text-gray-500 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>
            <h1 class="text-lg font-bold text-gray-900">Order Detail</h1>
        </header>

        <!-- Content -->
        <div v-if="loading" class="flex justify-center py-20">
            <div class="w-8 h-8 border-4 border-[#005c3d] border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        <div v-else-if="!order" class="px-4 py-20 text-center">
            <h3 class="text-lg font-bold text-gray-900">Order Not Found</h3>
            <button @click="$router.back()" class="mt-4 text-[#005c3d] font-medium underline">Go Back</button>
        </div>

        <div v-else class="px-4 py-6 space-y-6">
            <!-- Status Card -->
            <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                    <p class="text-xs text-gray-500">Order ID</p>
                    <p class="text-sm font-bold text-gray-900 mt-0.5">{{ order.id }}</p>
                </div>
                <div class="text-right">
                    <p class="text-xs text-gray-500 mb-1">Status</p>
                    <span :class="[
                        'text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wide',
                        order.status === 'shipped' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    ]">
                        {{ order.status }}
                    </span>
                </div>
            </div>

            <!-- Delivery Info -->
            <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <h3 class="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-50 pb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Delivery Address
                </h3>
                <div class="text-sm text-gray-600 space-y-1">
                    <p class="font-bold text-gray-900">{{ order.customer.name }}</p>
                    <p>{{ order.customer.phone }}</p>
                    <p class="mt-2">{{ order.customer.address }}</p>
                </div>
            </div>

            <!-- Items -->
            <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <h3 class="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-50 pb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    Order Items
                </h3>
                
                <div class="space-y-4">
                    <div v-for="(item, index) in order.items" :key="index" class="flex gap-4 items-start">
                        <div class="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center">
                            <img :src="item.imageUrl || '/images/mask.png'" class="w-full h-full object-cover" />
                        </div>
                        <div class="flex-1 min-w-0">
                            <h4 class="text-sm font-bold text-gray-900 truncate">{{ item.title }}</h4>
                            <p v-if="item.variantLabel" class="text-xs text-gray-500 mt-1 bg-gray-100 inline-block px-2 py-0.5 rounded">{{ item.variantLabel }}</p>
                            <div class="flex justify-between items-center mt-2">
                                <span class="text-sm font-medium text-gray-700">฿{{ item.price.toFixed(2) }}</span>
                                <span class="text-xs font-bold text-gray-500">× {{ item.quantity }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Totals -->
                <div class="mt-6 border-t border-gray-100 pt-4 space-y-2">
                    <div class="flex justify-between text-sm text-gray-500">
                        <span>Subtotal</span>
                        <span>฿{{ order.totalPrice.toFixed(2) }}</span>
                    </div>
                    <div class="flex justify-between text-sm text-gray-500">
                        <span>Shipping</span>
                        <span>฿0.00</span>
                    </div>
                    <div class="flex justify-between text-base font-bold text-gray-900 mt-2 pt-2 border-t border-gray-50">
                        <span>Total</span>
                        <span class="text-[#005c3d]">฿{{ order.totalPrice.toFixed(2) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'
import { useOrdersStore } from '../stores/orders'

export default {
    name: 'OrderDetailView',
    data() {
        return {
            loading: true,
            order: null,
        }
    },
    mounted() {
        this.fetchOrderDetails()
    },
    methods: {
        async fetchOrderDetails() {
            this.loading = true
            try {
                const order = await useOrdersStore().fetchOrderById(this.$route.params.id)
                const userId = useAuthStore().user?.id
                if (order && order.userId === userId) {
                    this.order = order
                }
            } catch (e) {
                // order stays null → shows "Order Not Found"
            } finally {
                this.loading = false
            }
        },
    },
}
</script>

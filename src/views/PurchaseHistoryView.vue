<template>
    <div class="bg-[#f8f9fa] min-h-screen pb-10">
        <!-- Header -->
        <header class="bg-white px-4 py-4 flex items-center sticky top-0 z-50 shadow-sm">
            <button @click="$router.back()" class="text-gray-500 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>
            <h1 class="text-lg font-bold text-gray-900">Purchase History</h1>
        </header>

        <!-- Content -->
        <div class="px-4 py-6">
            <!-- Not logged in -->
            <div v-if="!isAuthenticated" class="text-center py-12">
                <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 class="text-lg font-bold text-gray-900 mb-1">Sign in to view your orders</h3>
                <p class="text-sm text-gray-500 mb-6">You need to be signed in to see your purchase history.</p>
                <router-link to="/login" class="inline-block bg-[#005c3d] text-white font-medium px-6 py-2.5 rounded-full">
                    Sign In
                </router-link>
            </div>

            <!-- Loading State -->
            <div v-else-if="loading" class="flex justify-center py-20">
                <div class="w-8 h-8 border-4 border-[#005c3d] border-t-transparent rounded-full animate-spin"></div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl px-5 py-4 flex items-center justify-between">
                <span>{{ error }}</span>
                <button @click="fetchOrders" class="text-red-600 font-semibold underline text-sm ml-4">Retry</button>
            </div>

            <!-- Content Area -->
            <div v-else-if="isAuthenticated">
                <!-- Empty State -->
                <div v-if="orders.length === 0" class="text-center py-12">
                    <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h3 class="text-lg font-bold text-gray-900 mb-1">No orders yet</h3>
                    <p class="text-sm text-gray-500 mb-6">You haven't placed any orders.</p>
                    <router-link to="/" class="inline-block bg-[#005c3d] text-white font-medium px-6 py-2.5 rounded-full">
                        Start Shopping
                    </router-link>
                </div>

                <!-- Orders List -->
                <div v-else class="space-y-4">
                <div 
                    v-for="order in orders" 
                    :key="order.id"
                    @click="$router.push('/purchase-history/' + order.id)"
                    class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:border-gray-300 transition-colors"
                >
                    <div class="flex justify-between items-start mb-3 border-b border-gray-50 pb-3">
                        <div>
                            <span class="text-xs text-gray-500">Order {{ order.id }}</span>
                            <p class="text-sm font-semibold text-gray-900 mt-0.5">{{ formatDate(order.date) }}</p>
                        </div>
                        <span :class="[
                            'text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide',
                            order.status === 'shipped' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        ]">
                            {{ order.status }}
                        </span>
                    </div>

                    <div v-if="order.customer" class="mb-4 flex items-start gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <div class="text-xs text-gray-600 leading-relaxed min-w-0">
                            <p class="font-semibold text-gray-900 truncate">{{ order.customer.name }} <span class="text-gray-400 font-normal mx-1">|</span> {{ order.customer.phone }}</p>
                            <p class="truncate">{{ order.customer.addressLine }}</p>
                        </div>
                    </div>

                    <div class="flex gap-4 items-center">
                        <div class="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center">
                            <img :src="order.items[0]?.imageUrl || '/images/mask.png'" class="w-full h-full object-cover" />
                        </div>
                        <div class="flex-1 min-w-0">
                            <h4 class="text-sm font-medium text-gray-900 truncate">{{ order.items[0]?.title || 'Unknown Item' }}</h4>
                            <p class="text-xs text-gray-500 mt-1">
                                {{ order.items.length }} item{{ order.items.length > 1 ? 's' : '' }} total
                            </p>
                        </div>
                        <div class="text-right shrink-0">
                            <p class="text-xs text-gray-500 mb-1">Total</p>
                            <p class="text-sm font-bold text-[#005c3d]">฿{{ order.totalPrice.toFixed(2) }}</p>
                        </div>
                    </div>
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
    name: 'PurchaseHistoryView',
    data() {
        return {
            loading: false,
            error: null,
            orders: [],
        }
    },
    computed: {
        isAuthenticated() { return useAuthStore().isAuthenticated },
        userId() { return useAuthStore().user?.id },
    },
    mounted() {
        if (this.isAuthenticated) this.fetchOrders()
    },
    methods: {
        async fetchOrders() {
            this.loading = true
            this.error = null
            try {
                this.orders = await useOrdersStore().fetchOrdersByUser(this.userId)
            } catch (e) {
                this.error = 'Failed to load orders.'
            } finally {
                this.loading = false
            }
        },
        formatDate(date) {
            if (!date) return '—'
            return new Intl.DateTimeFormat('th-TH', {
                year: 'numeric', month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
            }).format(date)
        },
    },
}
</script>

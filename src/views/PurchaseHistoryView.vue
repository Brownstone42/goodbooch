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
            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center py-20">
                <div class="w-8 h-8 border-4 border-[#005c3d] border-t-transparent rounded-full animate-spin"></div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl px-5 py-4 flex items-center justify-between">
                <span>{{ error }}</span>
                <button @click="fetchOrders" class="text-red-600 font-semibold underline text-sm ml-4">Retry</button>
            </div>

            <!-- Empty State -->
            <div v-else-if="orders.length === 0" class="text-center py-20">
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
</template>

<script>
export default {
    name: 'PurchaseHistoryView',
    data() {
        return {
            loading: true,
            error: null,
            orders: [],
        }
    },
    mounted() {
        this.fetchOrders()
    },
    methods: {
        fetchOrders() {
            this.loading = true
            this.error = null
            
            // Mock data to demonstrate layout without Firebase
            setTimeout(() => {
                this.orders = [
                    {
                        id: 'ORD-12345',
                        date: new Date('2026-05-08T10:30:00'),
                        status: 'shipped',
                        totalPrice: 1250.00,
                        items: [
                            { id: 1, title: 'Premium Collagen', imageUrl: null, quantity: 2, price: 500, variantLabel: 'Pack of 30' },
                            { id: 2, title: 'Vitamin C Plus', imageUrl: null, quantity: 1, price: 250, variantLabel: null }
                        ]
                    },
                    {
                        id: 'ORD-12346',
                        date: new Date('2026-05-01T14:15:00'),
                        status: 'pending',
                        totalPrice: 850.00,
                        items: [
                            { id: 3, title: 'Whey Protein Isolate', imageUrl: null, quantity: 1, price: 850, variantLabel: 'Chocolate' }
                        ]
                    }
                ]
                this.loading = false
            }, 600)
        },
        formatDate(date) {
            return new Intl.DateTimeFormat('th-TH', { 
                year: 'numeric', month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
            }).format(date)
        }
    }
}
</script>

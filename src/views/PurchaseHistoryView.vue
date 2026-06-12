<template>
    <div class="bg-[#f8f9fa] min-h-screen pb-10">
        <!-- Header -->
        <header class="bg-white px-4 py-4 flex items-center gap-3 sticky top-0 z-50 shadow-sm">
            <button
                @click="$router.back()"
                class="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center shrink-0"
                aria-label="Back"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <h1 class="text-lg font-bold text-gray-900">ประวัติการสั่งซื้อ</h1>
        </header>

        <!-- Not logged in -->
        <div class="px-4 py-6">
            <EmptyState v-if="!isAuthenticated" title="Sign in to view your orders" message="You need to be signed in to see your purchase history.">
                <template #icon>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </template>
                <router-link to="/login" class="inline-block bg-brand text-white font-medium px-6 py-2.5 rounded-full">
                    Sign In
                </router-link>
            </EmptyState>

            <div v-else-if="loading" class="flex justify-center py-20">
                <LoadingSpinner />
            </div>

            <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl px-5 py-4 flex items-center justify-between">
                <span>{{ error }}</span>
                <button @click="fetchOrders" class="text-red-600 font-semibold underline text-sm ml-4">Retry</button>
            </div>

            <div v-else>
                <!-- Search -->
                <div class="relative mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                    </svg>
                    <input
                        v-model="search"
                        type="text"
                        placeholder="ค้นหา โดย เลขสั่งซื้อ หรือ ชื่อสินค้า..."
                        class="w-full bg-white border border-gray-200 rounded-full pl-10 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-brand"
                    />
                </div>

                <!-- Payment status filter -->
                <div class="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
                    <button
                        v-for="opt in statusFilterOptions"
                        :key="opt.value"
                        @click="filterPaymentStatus = opt.value"
                        :class="[
                            'shrink-0 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all',
                            filterPaymentStatus === opt.value
                                ? 'bg-gray-800 text-white border-gray-800'
                                : 'bg-white text-gray-500 border-gray-200'
                        ]"
                    >{{ opt.label }}</button>
                </div>

                <!-- Empty -->
                <EmptyState v-if="filteredOrders.length === 0" title="ไม่พบคำสั่งซื้อ" message="คุณยังไม่มีประวัติการสั่งซื้อ">
                    <template #icon>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </template>
                    <router-link to="/" class="inline-block bg-brand text-white font-medium px-6 py-2.5 rounded-full">
                        เริ่มช้อปปิ้ง
                    </router-link>
                </EmptyState>

                <!-- Order Cards -->
                <div v-else class="space-y-3">
                    <div
                        v-for="order in filteredOrders"
                        :key="order.id"
                        class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                        <!-- Card header: order ID + date + status -->
                        <div class="px-4 pt-3 pb-2.5 flex justify-between items-start border-b border-gray-100">
                            <div>
                                <span class="text-xs font-medium text-gray-500">คำสั่งซื้อ #{{ order.id }}</span>
                                <p class="text-xs text-gray-400 mt-0.5">วันที่ {{ formatDate(order.date) }}</p>
                            </div>
                            <div class="flex flex-col items-end gap-1">
                                <span :class="[
                                    'text-xs font-bold px-2.5 py-0.5 rounded-full',
                                    order.paymentStatus === 'success' ? 'bg-green-100 text-green-700' :
                                    order.paymentStatus === 'failed' ? 'bg-red-100 text-red-600' :
                                    order.paymentStatus === 'expired' || order.paymentStatus === 'canceled' ? 'bg-gray-100 text-gray-500' :
                                    'bg-amber-100 text-amber-600'
                                ]">
                                    {{ order.paymentStatus === 'success' ? 'ชำระแล้ว' :
                                       order.paymentStatus === 'failed' ? 'ไม่สำเร็จ' :
                                       order.paymentStatus === 'expired' ? 'หมดอายุ' :
                                       order.paymentStatus === 'canceled' ? 'ยกเลิก' : 'รอชำระ' }}
                                </span>
                                <span v-if="order.parcelStatus" :class="[
                                    'text-xs font-bold px-2.5 py-0.5 rounded-full',
                                    order.parcelStatus === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                                    order.parcelStatus === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                    'bg-amber-100 text-amber-600'
                                ]">
                                    {{ order.parcelStatus === 'delivered' ? 'ส่งถึงแล้ว' :
                                       order.parcelStatus === 'shipped' ? 'จัดส่งแล้ว' : 'กำลังเตรียม' }}
                                </span>
                            </div>
                        </div>

                        <!-- First item preview -->
                        <div class="px-4 py-3 flex items-center gap-3">
                            <img
                                :src="order.items[0]?.imageUrl || '/images/mask.png'"
                                :alt="order.items[0]?.title"
                                class="w-14 h-14 rounded-xl object-cover flex-shrink-0 bg-gray-100"
                            />
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-900 truncate">{{ order.items[0]?.title }}</p>
                                <p v-if="order.items[0]?.variantLabel" class="text-xs text-gray-400 mt-0.5">{{ order.items[0]?.variantLabel }}</p>
                                <p class="text-sm font-semibold text-gray-800 mt-0.5">฿{{ (order.items[0]?.price ?? 0).toFixed(2) }}</p>
                            </div>
                            <div class="flex flex-col items-end gap-1 flex-shrink-0 self-start mt-1">
                                <span class="text-xs text-gray-400">x{{ order.items[0]?.quantity }}</span>
                                <span class="text-xs text-gray-400">ทั้งหมด {{ order.items.length }} รายการ</span>
                            </div>
                        </div>

                        <!-- Expanded: remaining items -->
                        <div v-if="expandedOrders.has(order.id)" class="px-4 space-y-1 border-t border-gray-50">
                            <div
                                v-for="item in order.items.slice(1)"
                                :key="item.id || item.variantId"
                                class="flex items-center gap-3 py-2.5"
                            >
                                <img
                                    :src="item.imageUrl || '/images/mask.png'"
                                    :alt="item.title"
                                    class="w-12 h-12 rounded-xl object-cover flex-shrink-0 bg-gray-100"
                                />
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-medium text-gray-900 truncate">{{ item.title }}</p>
                                    <p v-if="item.variantLabel" class="text-xs text-gray-400 mt-0.5">{{ item.variantLabel }}</p>
                                    <p class="text-sm font-semibold text-gray-800 mt-0.5">฿{{ item.price.toFixed(2) }}</p>
                                </div>
                                <span class="text-xs text-gray-400 flex-shrink-0">x{{ item.quantity }}</span>
                            </div>
                        </div>

                        <!-- Card footer: total + buttons -->
                        <div class="px-4 py-3 flex items-center justify-between border-t border-gray-50">
                            <div>
                                <p class="text-xs text-gray-400">ยอดรวมสุทธิ</p>
                                <p class="text-base font-bold text-gray-900">฿{{ order.totalPrice.toFixed(2) }}</p>
                            </div>
                            <div class="flex gap-2">
                                <button
                                    @click="toggleExpand(order.id)"
                                    class="text-xs px-3 py-2 rounded-xl border border-gray-200 text-gray-500"
                                >
                                    {{ expandedOrders.has(order.id) ? 'ซ่อน' : 'รายละเอียดเพิ่มเติม' }}
                                </button>
                                <button
                                    v-if="order.paymentStatus === 'pending'"
                                    @click="goToPayment(order)"
                                    class="text-xs px-3 py-2 rounded-xl bg-amber-500 text-white font-medium"
                                >
                                    ชำระเงิน
                                </button>
                                <button
                                    v-else
                                    @click="reorder(order)"
                                    class="text-xs px-3 py-2 rounded-xl bg-green-500 text-white font-medium"
                                >
                                    สั่งซื้ออีกครั้ง
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import EmptyState from '../components/EmptyState.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import { formatDateTH } from '../utils/formatDate'
import { useAuthStore } from '../stores/auth'
import { useOrdersStore } from '../stores/orders'
import { useCartStore } from '../stores/cart'
import { useProductsStore } from '../stores/products'

function resolveItemImage(item, productsStore) {
    if (item.imageUrl) return item.imageUrl
    const product = productsStore.getById(item.productId)
    const variant = product?.variants?.find((v) => v.id === item.variantId)
    return variant?.imageUrl || product?.coverImageUrl || product?.imageUrl || '/images/mask.png'
}

export default {
    name: 'PurchaseHistoryView',
    components: {
        EmptyState,
        LoadingSpinner,
    },
    data() {
        return {
            loading: false,
            error: null,
            orders: [],
            search: '',
            filterPaymentStatus: '',
            expandedOrders: new Set(),
        }
    },
    computed: {
        isAuthenticated() { return useAuthStore().isAuthenticated },
        userId() { return useAuthStore().user?.id },
        statusFilterOptions() {
            return [
                { value: '', label: 'ทั้งหมด' },
                { value: 'pending', label: 'รอชำระ' },
                { value: 'success', label: 'ชำระแล้ว' },
                { value: 'failed', label: 'ไม่สำเร็จ' },
                { value: 'expired', label: 'หมดอายุ' },
            ]
        },
        filteredOrders() {
            let result = this.orders
            if (this.filterPaymentStatus) {
                result = result.filter((o) => o.paymentStatus === this.filterPaymentStatus)
            }
            const q = this.search.trim().toLowerCase()
            if (!q) return result
            return result.filter((order) =>
                order.id.toLowerCase().includes(q) ||
                order.items.some((item) => item.title?.toLowerCase().includes(q))
            )
        },
    },
    mounted() {
        if (this.isAuthenticated) this.fetchOrders()
    },
    methods: {
        async fetchOrders() {
            this.loading = true
            this.error = null
            try {
                const productsStore = useProductsStore()
                if (productsStore.products.length === 0) {
                    await productsStore.getProducts()
                }
                const orders = await useOrdersStore().getOrdersByUser(this.userId)
                this.orders = orders.map((order) => ({
                    ...order,
                    items: order.items.map((item) => ({
                        ...item,
                        imageUrl: resolveItemImage(item, productsStore),
                    })),
                }))
            } catch (e) {
                this.error = 'Failed to load orders.'
            } finally {
                this.loading = false
            }
        },
        toggleExpand(orderId) {
            const next = new Set(this.expandedOrders)
            if (next.has(orderId)) {
                next.delete(orderId)
            } else {
                next.add(orderId)
            }
            this.expandedOrders = next
        },
        goToPayment(order) {
            this.$router.push({
                path: '/payment',
                query: {
                    orderId: order.id,
                    qrImage: order.qrImage || '',
                    amount: order.totalPrice,
                },
            })
        },
        reorder(order) {
            const productsStore = useProductsStore()
            const cartItems = order.items.map((item) => {
                const variant = productsStore.getById(item.productId)?.variants?.find((v) => v.id === item.variantId)
                return {
                    key: item.id || `${item.productId}_${item.variantId}`,
                    productId: item.productId,
                    variantId: item.variantId,
                    variantLabel: item.variantLabel || null,
                    title: item.title,
                    price: item.price,
                    imageUrl: item.imageUrl,
                    stock: variant?.stock,
                    quantity: item.quantity,
                }
            })
            useCartStore().reorderItems(cartItems)
            this.$router.push('/cart')
        },
        formatDate: formatDateTH,
    },
}
</script>

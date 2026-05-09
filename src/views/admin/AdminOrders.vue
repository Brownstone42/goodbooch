<template>
    <div class="flex min-h-screen bg-slate-50 font-sans text-slate-900">
        <AdminSidebar />

        <div class="flex-1 flex flex-col min-w-0">
            <AdminHeader />

            <main class="p-8 flex-1">
                <div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div class="px-8 py-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 class="text-xl font-bold text-slate-900">Orders</h2>
                            <p class="text-sm text-slate-500 mt-1">Manage and update customer orders.</p>
                        </div>
                        <div class="flex items-center gap-3">
                            <div class="flex items-center bg-slate-100 rounded-xl p-1 gap-1">
                                <button
                                    v-for="opt in statusOptions"
                                    :key="opt.value"
                                    @click="filterStatus = opt.value"
                                    :class="[
                                        'px-4 py-1.5 rounded-lg text-sm font-semibold transition-all',
                                        filterStatus === opt.value
                                            ? 'bg-white text-slate-900 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700'
                                    ]"
                                >{{ opt.label }}</button>
                            </div>
                            <div class="relative">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    v-model="search"
                                    type="text"
                                    placeholder="Search orders..."
                                    class="pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#005c3d] focus:bg-white transition-all w-56"
                                />
                            </div>
                        </div>
                    </div>

                    <div v-if="error" class="mx-8 mt-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-5 py-3 flex items-center justify-between">
                        <span>{{ error }}</span>
                        <button @click="reload" class="text-red-600 font-semibold underline text-sm ml-4">Retry</button>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-slate-50">
                                    <th class="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                                    <th class="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Items</th>
                                    <th class="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                                    <th class="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th class="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <tr v-if="loading">
                                    <td colspan="5" class="px-8 py-16 text-center">
                                        <div class="flex justify-center">
                                            <div class="w-6 h-6 border-4 border-slate-300 border-t-[#005c3d] rounded-full animate-spin"></div>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-for="order in orders" :key="order.id" class="hover:bg-slate-50/50 transition-colors">
                                    <td class="px-8 py-5">
                                        <p class="font-bold text-slate-900 text-sm">{{ order.customerName }}</p>
                                        <p class="text-xs text-slate-500 mt-0.5">{{ order.phone }}</p>
                                        <p class="text-xs text-slate-400 mt-0.5 max-w-[180px] truncate">{{ order.address }}</p>
                                    </td>
                                    <td class="px-8 py-5">
                                        <div class="flex flex-col gap-3 min-w-[320px]">
                                            <div v-for="(item, index) in order.items" :key="item.key || index" class="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                                                <div class="w-14 h-14 rounded-lg overflow-hidden bg-slate-50 shrink-0 border border-slate-100 flex items-center justify-center">
                                                    <img :src="item.imageUrl || '/images/mask.png'" class="w-full h-full object-cover" />
                                                </div>
                                                <div class="flex-1 min-w-0">
                                                    <div class="flex justify-between items-start gap-2">
                                                        <p class="font-bold text-slate-900 text-sm truncate" :title="item.title">{{ item.title }}</p>
                                                        <span class="font-bold text-[#005c3d] text-sm bg-[#005c3d]/10 px-2 py-0.5 rounded-lg whitespace-nowrap">× {{ item.quantity }}</span>
                                                    </div>
                                                    <p v-if="item.variantLabel" class="text-xs font-medium text-slate-500 mt-0.5 truncate bg-slate-100 inline-block px-2 py-0.5 rounded-md">{{ item.variantLabel }}</p>
                                                    <p class="text-xs font-bold text-slate-700 mt-1.5">฿{{ (item.price * item.quantity).toFixed(2) }} <span class="text-[10px] text-slate-400 font-normal ml-1">(฿{{ item.price.toFixed(2) }} ea)</span></p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-8 py-5">
                                        <span class="font-bold text-slate-900">฿{{ order.totalPrice.toFixed(2) }}</span>
                                    </td>
                                    <td class="px-8 py-5">
                                        <select
                                            :value="order.status"
                                            @change="updateStatus(order.id, $event.target.value)"
                                            :class="[
                                                'text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border-0 cursor-pointer focus:ring-2 focus:ring-[#005c3d] focus:outline-none',
                                                order.status === 'shipped' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                            ]"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="shipped">Shipped</option>
                                        </select>
                                    </td>
                                    <td class="px-8 py-5">
                                        <span class="text-sm text-slate-500">{{ formatDate(order.createdAt) }}</span>
                                    </td>
                                </tr>
                                <tr v-if="!loading && orders.length === 0">
                                    <td colspan="5" class="px-8 py-16 text-center text-slate-400 text-sm">
                                        {{ search || filterStatus ? 'No orders match your filters.' : 'No orders yet.' }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="px-8 py-6 bg-slate-50 border-t border-slate-200">
                        <p class="text-sm text-slate-500 font-medium">{{ orders.length }} order{{ orders.length === 1 ? '' : 's' }} total</p>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script>
import AdminSidebar from '../../components/admin/AdminSidebar.vue'
import AdminHeader from '../../components/admin/AdminHeader.vue'
import { useOrdersStore } from '../../stores/orders'

export default {
    name: 'AdminOrders',
    components: {
        AdminSidebar,
        AdminHeader,
    },
    data() {
        return {
            search: '',
            filterStatus: '',
        }
    },
    computed: {
        statusOptions() {
            return [
                { value: '', label: 'All' },
                { value: 'pending', label: 'Pending' },
                { value: 'shipped', label: 'Shipped' },
            ]
        },
        orders() {
            let all = useOrdersStore().orders
            if (this.filterStatus) {
                all = all.filter((o) => o.status === this.filterStatus)
            }
            if (!this.search.trim()) return all
            const q = this.search.toLowerCase()
            return all.filter((o) =>
                o.customerName?.toLowerCase().includes(q) ||
                o.phone?.toLowerCase().includes(q) ||
                o.items?.some((i) => i.title?.toLowerCase().includes(q))
            )
        },
        loading() {
            return useOrdersStore().loading
        },
        error() {
            return useOrdersStore().error
        },
    },
    mounted() {
        useOrdersStore().getOrders()
    },
    methods: {
        reload() {
            useOrdersStore().getOrders()
        },
        updateStatus(orderId, status) {
            useOrdersStore().updateOrderStatus(orderId, status)
        },
        formatDate(timestamp) {
            if (!timestamp) return '-'
            return timestamp.toDate().toLocaleDateString()
        },
    },
}
</script>

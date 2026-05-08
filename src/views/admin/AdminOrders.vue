<template>
    <div class="flex min-h-screen bg-slate-50 font-sans text-slate-900">
        <AdminSidebar />

        <div class="flex-1 flex flex-col min-w-0">
            <AdminHeader />

            <main class="p-8 flex-1">
                <div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div class="px-8 py-6 border-b border-slate-200">
                        <h2 class="text-xl font-bold text-slate-900">Orders</h2>
                        <p class="text-sm text-slate-500 mt-1">Manage and update customer orders.</p>
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
                                        <div v-for="item in order.items" :key="item.id" class="text-sm text-slate-600 leading-relaxed">
                                            {{ item.title }}{{ item.variantLabel ? ' (' + item.variantLabel + ')' : '' }} × {{ item.quantity }}
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
                                    <td colspan="5" class="px-8 py-16 text-center text-slate-400 text-sm">No orders yet.</td>
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
    computed: {
        orders() {
            return useOrdersStore().orders
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

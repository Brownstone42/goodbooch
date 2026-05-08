<template>
    <div class="flex min-h-screen bg-slate-50 font-sans text-slate-900">
        <!-- Sidebar -->
        <AdminSidebar />

        <!-- Main Content -->
        <div class="flex-1 flex flex-col min-w-0">
            <!-- Header -->
            <AdminHeader />

            <!-- Content Area -->
            <main class="p-8 flex-1">
                <!-- Stats Overview -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div v-for="stat in stats" :key="stat.label" class="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-5">
                        <div :class="['w-14 h-14 rounded-2xl flex items-center justify-center', stat.bg]">
                            <component :is="stat.icon" :class="['w-7 h-7', stat.color]" />
                        </div>
                        <div>
                            <p class="text-xs font-bold text-slate-500 uppercase tracking-wider">{{ stat.label }}</p>
                            <p class="text-2xl font-black text-slate-900 mt-0.5">{{ stat.value }}</p>
                        </div>
                    </div>
                </div>

                <!-- Main Section -->
                <ProductTable />
            </main>
        </div>
    </div>
</template>

<script>
import AdminSidebar from '../../components/admin/AdminSidebar.vue'
import AdminHeader from '../../components/admin/AdminHeader.vue'
import ProductTable from '../../components/admin/ProductTable.vue'

export default {
    name: 'AdminDashboard',
    components: {
        AdminSidebar,
        AdminHeader,
        ProductTable,
        SalesIcon: {
            template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
        },
        OrdersIcon: {
            template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>`
        },
        InventoryIcon: {
            template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>`
        },
        CustomersIcon: {
            template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>`
        }
    },
    data() {
        return {
            stats: [
                { label: 'Total Sales', value: '฿124,500', icon: 'SalesIcon', bg: 'bg-emerald-50', color: 'text-emerald-600' },
                { label: 'New Orders', value: '84', icon: 'OrdersIcon', bg: 'bg-blue-50', color: 'text-blue-600' },
                { label: 'Inventory', value: '1,205', icon: 'InventoryIcon', bg: 'bg-amber-50', color: 'text-amber-600' },
                { label: 'Customers', value: '420', icon: 'CustomersIcon', bg: 'bg-purple-50', color: 'text-purple-600' }
            ]
        }
    }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

body {
    font-family: 'Plus+Jakarta+Sans', sans-serif;
}
</style>

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
    }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

body {
    font-family: 'Plus+Jakarta+Sans', sans-serif;
}
</style>

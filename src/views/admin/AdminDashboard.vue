<template>
    <AdminLayout>
        <ProductTable />
    </AdminLayout>
</template>

<script>
import AdminLayout from '../../components/admin/AdminLayout.vue'
import ProductTable from '../../components/admin/ProductTable.vue'

export default {
    name: 'AdminDashboard',
    components: {
        AdminLayout,
        ProductTable,
    }
}
</script>

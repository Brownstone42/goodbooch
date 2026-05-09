<template>
    <div class="flex min-h-screen bg-slate-50 font-sans text-slate-900">
        <AdminSidebar />
        <div class="flex-1 flex flex-col min-w-0">
            <AdminHeader />
            <main class="p-8 flex-1">
                <slot />
            </main>
        </div>
    </div>
</template>

<script>
import AdminSidebar from './AdminSidebar.vue'
import AdminHeader from './AdminHeader.vue'

export default {
    name: 'AdminLayout',
    components: {
        AdminSidebar,
        AdminHeader,
    }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

body {
    font-family: 'Plus+Jakarta+Sans', sans-serif;
}
</style>

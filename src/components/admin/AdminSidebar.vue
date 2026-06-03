<template>
    <aside class="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0">
        <div class="p-6 flex items-center gap-3">
            <div class="w-8 h-8 bg-brand rounded-lg flex items-center justify-center font-bold text-white">G</div>
            <span class="text-xl font-bold tracking-tight">Goodbooch <span class="text-brand">Admin</span></span>
        </div>

        <nav class="flex-1 mt-6 px-4 space-y-1">
            <component
                v-for="item in menuItems"
                :key="item.name"
                :is="item.to ? 'router-link' : 'a'"
                :to="item.to || undefined"
                :href="item.to ? undefined : '#'"
                :class="[
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                    isActive(item) ? 'bg-brand text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                ]"
            >
                <div class="w-5 h-5 flex-shrink-0" v-html="item.svg"></div>
                <span class="font-medium">{{ item.name }}</span>
            </component>
        </nav>

        <div class="p-4 border-t border-slate-800">
            <div class="bg-slate-800/50 rounded-2xl p-4 flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold">AD</div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold truncate">Admin User</p>
                    <p class="text-xs text-slate-500 truncate">admin@goodbooch.com</p>
                </div>
            </div>
        </div>
    </aside>
</template>

<script>
export default {
    name: 'AdminSidebar',
    data() {
        return {
            menuItems: [
                {
                    name: 'Products',
                    to: '/admin',
                    svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>`,
                },
                {
                    name: 'Orders',
                    to: '/admin/orders',
                    svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>`,
                },
                {
                    name: 'Quotations',
                    to: '/admin/quotations',
                    svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>`,
                },
            ],
        }
    },
    methods: {
        isActive(item) {
            if (!item.to) return false
            return this.$route.path === item.to
        },
    },
}
</script>

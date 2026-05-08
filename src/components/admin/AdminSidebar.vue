<template>
    <aside class="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0">
        <div class="p-6 flex items-center gap-3">
            <div class="w-8 h-8 bg-[#005c3d] rounded-lg flex items-center justify-center font-bold text-white">G</div>
            <span class="text-xl font-bold tracking-tight">Goodbooch <span class="text-[#005c3d]">Admin</span></span>
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
                    isActive(item) ? 'bg-[#005c3d] text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
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
                    name: 'Dashboard',
                    to: '/admin',
                    svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>`,
                },
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
                    name: 'Customers',
                    to: null,
                    svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`,
                },
                {
                    name: 'Settings',
                    to: null,
                    svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`,
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

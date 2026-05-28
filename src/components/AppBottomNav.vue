<template>
    <nav class="bg-white border-t border-gray-200 flex shrink-0">
        <!-- หน้าหลัก -->
        <router-link
            to="/"
            class="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors"
            :class="isHome ? 'text-brand' : 'text-gray-400'"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 22V12h6v10" />
            </svg>
            <span class="text-[10px] font-medium leading-none">หน้าหลัก</span>
        </router-link>

        <!-- หมวดหมู่ -->
        <router-link
            to="/categories"
            class="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors"
            :class="isActive('/categories') ? 'text-brand' : 'text-gray-400'"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span class="text-[10px] font-medium leading-none">หมวดหมู่</span>
        </router-link>

        <!-- ตะกร้าสินค้า -->
        <router-link
            to="/cart"
            class="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors relative"
            :class="isActive('/cart') ? 'text-brand' : 'text-gray-400'"
        >
            <div class="relative">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span
                    v-if="cartItemCount > 0"
                    class="absolute -top-1.5 -right-1.5 bg-brand text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white"
                >
                    {{ cartItemCount }}
                </span>
            </div>
            <span class="text-[10px] font-medium leading-none">ตะกร้าสินค้า</span>
        </router-link>

        <!-- ขอใบเสนอราคา -->
        <router-link
            to="/quote"
            class="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors"
            :class="isActive('/quote') ? 'text-brand' : 'text-gray-400'"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span class="text-[10px] font-medium leading-none">ขอใบเสนอราคา</span>
        </router-link>

        <!-- โปรไฟล์ -->
        <router-link
            to="/profile"
            class="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors"
            :class="isActive('/profile') ? 'text-brand' : 'text-gray-400'"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-[10px] font-medium leading-none">โปรไฟล์</span>
        </router-link>
    </nav>
</template>

<script>
import { useCartStore } from '../stores/cart'

export default {
    name: 'AppBottomNav',
    computed: {
        cartItemCount() {
            return useCartStore().itemCount
        },
        isHome() {
            return this.$route.path === '/'
        },
    },
    methods: {
        isActive(path) {
            return this.$route.path === path
        },
    },
}
</script>

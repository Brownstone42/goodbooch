<template>
    <header class="bg-brand px-4 py-3 flex items-center gap-3">
        <!-- Search Bar -->
        <div class="flex-1 bg-white rounded-full flex items-center px-4 h-11 gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m1.1-5.15a6.25 6.25 0 11-12.5 0 6.25 6.25 0 0112.5 0z" />
            </svg>
            <span class="text-sm text-gray-400 flex-1 truncate">ค้นหาสินค้า..</span>
        </div>

        <!-- Hamburger Button -->
        <button @click="isMenuOpen = true" class="text-white shrink-0 p-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>
    </header>

    <!-- Overlay -->
    <div
        v-if="isMenuOpen"
        class="fixed inset-0 z-[60] bg-black/50 transition-opacity"
        @click="isMenuOpen = false"
    ></div>

    <!-- Sidebar Drawer -->
    <div
        class="fixed top-0 right-0 h-full w-72 bg-white z-[70] shadow-2xl transform transition-transform duration-300 flex flex-col"
        :class="isMenuOpen ? 'translate-x-0' : 'translate-x-full'"
    >
        <div class="p-5 flex items-center justify-between border-b border-gray-100">
            <h2 class="text-lg font-bold text-gray-900">Menu</h2>
            <button
                @click="isMenuOpen = false"
                class="text-gray-400 hover:text-gray-800 bg-gray-100 rounded-full p-1.5 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <div class="py-2 flex-1 overflow-y-auto">
            <router-link
                to="/profile/address"
                class="flex items-center gap-3 px-6 py-4 text-gray-700 font-medium hover:bg-gray-50 border-b border-gray-50 transition-colors"
                @click="isMenuOpen = false"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Address Info
            </router-link>
            <router-link
                to="/purchase-history"
                class="flex items-center gap-3 px-6 py-4 text-gray-700 font-medium hover:bg-gray-50 border-b border-gray-50 transition-colors"
                @click="isMenuOpen = false"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Purchase History
            </router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AppHeader',
    data() {
        return {
            isMenuOpen: false,
        }
    },
}
</script>

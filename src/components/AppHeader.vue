<template>
    <header class="bg-brand px-4 py-3 flex items-center gap-3">
        <!-- Search Bar -->
        <div class="flex-1 bg-white rounded-full flex items-center px-4 h-11 gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m1.1-5.15a6.25 6.25 0 11-12.5 0 6.25 6.25 0 0112.5 0z" />
            </svg>
            <input
                v-model="searchQuery"
                type="text"
                placeholder="ค้นหาสินค้า.."
                class="flex-1 text-sm text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
                @input="handleSearch"
            />
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
        <div class="flex-1 overflow-y-auto px-4 pt-4 pb-6 flex flex-col gap-6">

            <!-- บัญชีของฉัน -->
            <div>
                <p class="text-brand font-bold text-sm mb-2 px-2">บัญชีของฉัน</p>
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <router-link to="/profile/user" @click="isMenuOpen = false"
                        class="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <div class="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <span class="flex-1 text-sm font-medium text-gray-800">ข้อมูลส่วนตัว</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </router-link>
                    <router-link to="/profile/address" @click="isMenuOpen = false"
                        class="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <div class="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <span class="flex-1 text-sm font-medium text-gray-800">ที่อยู่สำหรับจัดส่ง</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </router-link>
                    <router-link to="/profile/payment" @click="isMenuOpen = false"
                        class="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors">
                        <div class="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                        <span class="flex-1 text-sm font-medium text-gray-800">วิธีการชำระเงิน</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </router-link>
                </div>
            </div>

            <!-- รายการของฉัน -->
            <div>
                <p class="text-brand font-bold text-sm mb-2 px-2">รายการของฉัน</p>
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <router-link to="/favorites" @click="isMenuOpen = false"
                        class="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <div class="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <span class="flex-1 text-sm font-medium text-gray-800">สินค้าโปรด</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </router-link>
                    <router-link to="/purchase-history" @click="isMenuOpen = false"
                        class="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <div class="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span class="flex-1 text-sm font-medium text-gray-800">ประวัติการสั่งซื้อ</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </router-link>
                    <router-link to="/my-quotations" @click="isMenuOpen = false" class="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors">
                        <div class="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <span class="flex-1 text-sm font-medium text-gray-800">ใบเสนอราคาของฉัน</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </router-link>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
export default {
    name: 'AppHeader',
    data() {
        return {
            isMenuOpen: false,
            searchQuery: '',
        }
    },
    watch: {
        '$route.query.q'(val) {
            this.searchQuery = val || ''
        },
        '$route.path'(path) {
            if (path !== '/categories') this.searchQuery = ''
        },
    },
    methods: {
        handleSearch() {
            const q = this.searchQuery.trim()
            if (this.$route.path === '/categories') {
                this.$router.replace({ path: '/categories', query: { ...this.$route.query, q: q || undefined } })
            } else if (q) {
                this.$router.push({ path: '/categories', query: { q } })
            }
        },
    },
}
</script>

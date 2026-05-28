<template>
    <div class="bg-[#f8f9fa] min-h-screen pb-10">

        <!-- ===== LOGGED IN ===== -->
        <div v-if="isAuthenticated">

            <!-- Hero Header -->
            <div class="relative bg-brand overflow-hidden px-5 pt-10 pb-8">
                <!-- Gb watermark -->
                <span class="absolute -right-4 -bottom-4 text-[140px] font-black text-white/10 leading-none select-none pointer-events-none">Gb</span>

                <div class="flex items-center gap-4 relative z-10">
                    <!-- Avatar -->
                    <div class="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <!-- Name & email -->
                    <div>
                        <p class="text-white font-bold text-xl leading-tight">{{ user.name }}</p>
                        <p class="text-white/70 text-sm mt-0.5">{{ user.email || user.phone }}</p>
                    </div>
                </div>
            </div>

            <!-- Menu -->
            <div class="px-4 pt-6 flex flex-col gap-6">

                <!-- Section: บัญชีของฉัน -->
                <div>
                    <p class="text-brand font-bold text-base mb-3">บัญชีของฉัน</p>
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <button class="w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <div class="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <span class="flex-1 text-left text-sm font-medium text-gray-800">ข้อมูลส่วนตัว</span>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        <button @click="$router.push('/profile/address')" class="w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <div class="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <span class="flex-1 text-left text-sm font-medium text-gray-800">ที่อยู่สำหรับจัดส่ง</span>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        <button class="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors">
                            <div class="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                            <span class="flex-1 text-left text-sm font-medium text-gray-800">วิธีการชำระเงิน</span>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Section: รายการของฉัน -->
                <div>
                    <p class="text-brand font-bold text-base mb-3">รายการของฉัน</p>
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <button @click="$router.push('/purchase-history')" class="w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <div class="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span class="flex-1 text-left text-sm font-medium text-gray-800">ประวัติการสั่งซื้อ</span>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        <button class="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors">
                            <div class="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <span class="flex-1 text-left text-sm font-medium text-gray-800">ใบเสนอราคาของฉัน</span>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

            </div>
        </div>

        <!-- ===== NOT LOGGED IN ===== -->
        <div v-else class="px-4 pt-12 max-w-lg mx-auto">
            <div class="mb-8 text-center">
                <div class="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h1 class="text-2xl font-bold text-gray-900">เข้าสู่ระบบ</h1>
                <p class="text-gray-500 text-sm mt-1">กรอกชื่อและเบอร์โทรเพื่อดำเนินการต่อ</p>
            </div>

            <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{{ error }}</div>

            <form @submit.prevent="submit" class="flex flex-col gap-4">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">ชื่อ</label>
                    <input
                        v-model="form.name"
                        type="text"
                        placeholder="ชื่อ-นามสกุล"
                        autocomplete="name"
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-brand transition-colors"
                    />
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">เบอร์โทรศัพท์</label>
                    <input
                        v-model="form.phone"
                        type="tel"
                        placeholder="0XX-XXX-XXXX"
                        autocomplete="tel"
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-brand transition-colors"
                    />
                </div>
                <button
                    type="submit"
                    :disabled="loading"
                    class="w-full bg-brand text-white py-3.5 rounded-xl text-base font-semibold disabled:opacity-60 mt-2"
                >
                    {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
                </button>
            </form>
        </div>

    </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'

export default {
    name: 'ProfileView',
    data() {
        return {
            loading: false,
            error: '',
            form: { name: '', phone: '' },
        }
    },
    computed: {
        isAuthenticated() { return useAuthStore().isAuthenticated },
        user() { return useAuthStore().user },
    },
    methods: {
        async submit() {
            this.error = ''
            this.loading = true
            try {
                useAuthStore().login(this.form)
                this.form = { name: '', phone: '' }
            } catch (e) {
                this.error = e.message
            }
            this.loading = false
        },
    },
}
</script>

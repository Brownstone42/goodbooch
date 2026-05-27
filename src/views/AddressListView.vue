<template>
    <div class="bg-[#f8f9fa] min-h-full pb-8">

        <!-- Header -->
        <div class="px-4 pt-5 pb-4 flex items-center gap-3">
            <button
                @click="$router.back()"
                class="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center shrink-0"
                aria-label="Back"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <h1 class="text-xl font-bold text-gray-900">ที่อยู่การจัดส่ง</h1>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex justify-center items-center py-20">
            <div class="w-8 h-8 border-4 border-gray-200 border-t-brand rounded-full animate-spin"></div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="mx-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl px-5 py-4 flex items-center justify-between">
            <span>{{ error }}</span>
            <button @click="reload" class="text-red-600 font-semibold underline text-sm ml-4">Retry</button>
        </div>

        <!-- Address cards -->
        <div v-else class="px-4 flex flex-col gap-3">
            <div
                v-for="addr in addresses"
                :key="addr.id"
                class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
                <!-- Card body -->
                <div class="px-4 pt-4 pb-3">
                    <div class="flex items-start justify-between gap-2">
                        <div class="flex items-center gap-2 min-w-0">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-5 w-5 shrink-0"
                                :class="addr.isPrimary ? 'text-brand' : 'text-gray-300'"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.079 3.952-5.245 3.952-9.827a8.25 8.25 0 00-16.5 0c0 4.582 2.008 7.748 3.952 9.827a19.58 19.58 0 002.683 2.282 16.975 16.975 0 001.143.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                            </svg>
                            <span
                                class="font-semibold text-sm truncate"
                                :class="addr.isPrimary ? 'text-gray-900' : 'text-gray-400'"
                            >{{ addr.name }}</span>
                        </div>
                        <span
                            v-if="addr.isPrimary"
                            class="shrink-0 text-[11px] font-semibold text-white bg-brand px-2.5 py-0.5 rounded-full"
                        >ที่อยู่หลัก</span>
                    </div>

                    <p
                        class="mt-2 text-sm leading-relaxed"
                        :class="addr.isPrimary ? 'text-gray-600' : 'text-gray-400'"
                    >{{ fullAddress(addr) }}</p>

                    <p
                        class="mt-1 text-sm"
                        :class="addr.isPrimary ? 'text-gray-600' : 'text-gray-400'"
                    >{{ addr.phone }}</p>
                </div>

                <!-- Card footer -->
                <div class="border-t border-gray-100 px-4 py-2.5 flex items-center justify-between">
                    <button
                        v-if="!addr.isPrimary"
                        @click="handleSetPrimary(addr.id)"
                        class="text-brand text-sm font-medium"
                    >ตั้งเป็นที่อยู่หลัก</button>
                    <div v-else />

                    <div class="flex items-center gap-4">
                        <button
                            @click="$router.push(`/profile/address/${addr.id}/edit`)"
                            class="flex items-center gap-1 text-gray-500 text-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                            </svg>
                            แก้ไข
                        </button>
                        <button
                            @click="handleDelete(addr.id)"
                            class="flex items-center gap-1 text-gray-400 text-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                            ลบ
                        </button>
                    </div>
                </div>
            </div>

            <!-- Empty state -->
            <div v-if="addresses.length === 0" class="flex flex-col items-center justify-center py-16 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p class="text-sm font-medium">ยังไม่มีที่อยู่</p>
            </div>
        </div>

        <!-- Add button -->
        <div v-if="!loading && !error" class="px-4 mt-5">
            <button
                @click="$router.push('/profile/address/new')"
                :disabled="addresses.length >= 5"
                class="w-full bg-brand text-white py-4 rounded-2xl text-base font-semibold flex items-center justify-center gap-2 disabled:opacity-40"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.079 3.952-5.245 3.952-9.827a8.25 8.25 0 00-16.5 0c0 4.582 2.008 7.748 3.952 9.827a19.58 19.58 0 002.683 2.282 16.975 16.975 0 001.143.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                </svg>
                เพิ่มที่อยู่ใหม่
            </button>
            <p class="text-center text-xs text-gray-400 mt-3">เพิ่มได้สูงสุด 5 ที่อยู่ต่อหนึ่งบัญชี</p>
        </div>

    </div>
</template>

<script>
import { useAddressStore } from '../stores/address'
import { useAuthStore } from '../stores/auth'

export default {
    name: 'AddressListView',
    computed: {
        addresses() { return useAddressStore().addresses },
        loading()   { return useAddressStore().loading },
        error()     { return useAddressStore().error },
        userId()    { return useAuthStore().user?.id },
    },
    mounted() {
        if (!this.userId) {
            this.$router.replace('/login')
            return
        }
        useAddressStore().fetchAddresses(this.userId)
    },
    methods: {
        fullAddress(addr) {
            if (addr.detail) {
                return [addr.detail, addr.subdistrict, addr.district, addr.province, addr.postalCode]
                    .filter(Boolean).join(' ')
            }
            return addr.address || ''
        },
        reload() {
            useAddressStore().fetchAddresses(this.userId)
        },
        async handleSetPrimary(id) {
            await useAddressStore().setPrimary(this.userId, id)
        },
        async handleDelete(id) {
            if (!confirm('ต้องการลบที่อยู่นี้ใช่ไหม?')) return
            await useAddressStore().deleteAddress(this.userId, id)
        },
    },
}
</script>

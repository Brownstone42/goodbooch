<template>
    <div class="bg-[#f8f9fa] min-h-screen pb-24">

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
            <h1 class="text-xl font-bold text-gray-900">คำร้องขอใบเสนอราคา</h1>
        </div>

        <!-- Search -->
        <div class="px-4 mb-4">
            <div class="bg-white rounded-2xl border border-gray-100 flex items-center px-4 h-11 gap-2 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input v-model="search" type="text" placeholder="ค้นหา" class="flex-1 text-sm text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent" />
            </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex justify-center py-16">
            <div class="w-8 h-8 border-4 border-gray-200 border-t-brand rounded-full animate-spin"></div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="mx-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl px-4 py-3 flex items-center justify-between">
            <span>{{ error }}</span>
            <button @click="reload" class="font-semibold underline ml-4">ลองใหม่</button>
        </div>

        <!-- Empty -->
        <div v-else-if="filtered.length === 0" class="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </div>
            <p class="text-sm font-medium text-gray-500">{{ search ? 'ไม่พบผลการค้นหา' : 'ยังไม่มีคำร้องขอใบเสนอราคา' }}</p>
        </div>

        <!-- List -->
        <div v-else class="px-4 flex flex-col gap-3">
            <div v-for="q in filtered" :key="q.id" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                <!-- Card header: quotation no + date -->
                <div class="px-4 pt-4 pb-3 flex items-start justify-between gap-3">
                    <div>
                        <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Quotation No.</p>
                        <div class="flex items-center gap-2 mt-0.5">
                            <span class="text-sm font-bold text-brand">#{{ q.id.slice(0, 13).toUpperCase() }}</span>
                            <button @click="copyId(q.id)" class="text-[10px] text-gray-400 border border-gray-200 rounded-md px-1.5 py-0.5 hover:bg-gray-50 transition-colors">
                                {{ copied === q.id ? '✓' : 'คัดลอก' }}
                            </button>
                        </div>
                    </div>
                    <div class="text-right shrink-0 flex flex-col items-end gap-1.5">
                        <span class="text-xs font-semibold px-2.5 py-1 rounded-full"
                            :class="{
                                'bg-green-100 text-green-600':  q.status === 'approved',
                                'bg-red-100 text-red-500':      q.status === 'rejected',
                                'bg-yellow-100 text-yellow-600': q.status === 'pending',
                            }"
                        >{{ { approved: 'อนุมัติแล้ว', rejected: 'ถูกปฏิเสธ', pending: 'รอดำเนินการ' }[q.status] || 'รอดำเนินการ' }}</span>
                        <p class="text-xs text-gray-400">{{ formatDate(q.createdAt) }}</p>
                    </div>
                </div>

                <!-- Product preview row (first product) -->
                <div class="px-4 pb-3 flex items-start gap-3">
                    <div class="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100 flex items-center justify-center">
                        <img v-if="q.products[0].refProductImageUrl" :src="q.products[0].refProductImageUrl" class="w-full h-full object-cover" />
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-gray-900 truncate">{{ q.products[0].refProductName || q.products[0].description }}</p>
                        <p v-if="q.products[0].refProductVariantLabel" class="text-xs text-gray-400 mt-0.5">variant : {{ q.products[0].refProductVariantLabel }}</p>
                        <p v-if="q.products[0].refProductName && q.products[0].description" class="text-xs text-gray-400 mt-0.5 line-clamp-1">description : {{ q.products[0].description }}</p>
                        <p class="text-xs text-gray-400 mt-0.5">จำนวน : {{ q.products[0].quantity }}</p>
                    </div>
                </div>

                <!-- Item count -->
                <div v-if="!expanded[q.id]" class="px-4 pb-3 text-right">
                    <p class="text-xs text-gray-400">ทั้งหมด {{ q.products.length }} รายการ</p>
                </div>

                <!-- Expanded content (items 2+ and note) -->
                <template v-if="expanded[q.id]">
                    <div class="border-t border-gray-100 px-4 pb-3 flex flex-col gap-3">
                        <div v-for="(p, i) in q.products.slice(1)" :key="i" class="flex items-start gap-3 pt-3">
                            <div class="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100 flex items-center justify-center">
                                <img v-if="p.refProductImageUrl" :src="p.refProductImageUrl" class="w-full h-full object-cover" />
                                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-semibold text-gray-900 truncate">{{ p.refProductName || p.description }}</p>
                                <p v-if="p.refProductVariantLabel" class="text-xs text-gray-400 mt-0.5">variant : {{ p.refProductVariantLabel }}</p>
                                <p v-if="p.refProductName && p.description" class="text-xs text-gray-400 mt-0.5">description : {{ p.description }}</p>
                                <p class="text-xs text-gray-400 mt-0.5">จำนวน : {{ p.quantity }}</p>
                            </div>
                        </div>
                        <div v-if="q.note" class="bg-gray-50 rounded-xl px-3 py-2.5 mt-1">
                            <p class="text-xs font-semibold text-gray-500 mb-0.5">หมายเหตุ</p>
                            <p class="text-sm text-gray-600">{{ q.note }}</p>
                        </div>
                    </div>
                </template>

                <!-- Expand toggle (only shown if there are additional items or a note) -->
                <button
                    v-if="q.products.length > 1 || q.note"
                    @click="toggle(q.id)"
                    class="w-full border-t border-gray-100 py-3 flex items-center justify-center gap-1.5 text-xs font-medium text-gray-400 hover:bg-gray-50 transition-colors"
                >
                    <span>{{ expanded[q.id] ? 'ซ่อนรายละเอียด' : 'ดูรายละเอียดเพิ่มเติม' }}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 transition-transform duration-200"
                        :class="expanded[q.id] ? 'rotate-180' : ''"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>
        </div>

    </div>
</template>

<script>
import { useQuotationStore } from '../stores/quotation'
import { useAuthStore } from '../stores/auth'

export default {
    name: 'MyQuotationsView',
    data() {
        return {
            search: '',
            expanded: {},
            copied: null,
        }
    },
    computed: {
        loading() { return useQuotationStore().loadingUser },
        error()   { return useQuotationStore().userError },
        quotations() { return useQuotationStore().userQuotations },
        filtered() {
            if (!this.search.trim()) return this.quotations
            const q = this.search.toLowerCase()
            return this.quotations.filter((qt) =>
                qt.id.toLowerCase().includes(q) ||
                qt.company?.name?.toLowerCase().includes(q) ||
                qt.products?.some((p) =>
                    p.refProductName?.toLowerCase().includes(q) ||
                    p.description?.toLowerCase().includes(q)
                )
            )
        },
    },
    mounted() {
        const auth = useAuthStore()
        if (!auth.isAuthenticated) {
            this.$router.replace('/profile')
            return
        }
        useQuotationStore().fetchUserQuotations(auth.user.id)
    },
    methods: {
        toggle(id) {
            this.expanded = { ...this.expanded, [id]: !this.expanded[id] }
        },
        async copyId(id) {
            try {
                await navigator.clipboard.writeText(id)
                this.copied = id
                setTimeout(() => { this.copied = null }, 2000)
            } catch {}
        },
        formatDate(ts) {
            if (!ts) return '—'
            const d = ts.toDate ? ts.toDate() : new Date(ts)
            return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
        },
        reload() {
            const auth = useAuthStore()
            useQuotationStore().fetchUserQuotations(auth.user.id)
        },
    },
}
</script>

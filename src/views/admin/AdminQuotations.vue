<template>
    <div class="p-6 max-w-4xl mx-auto">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">ใบเสนอราคา</h1>

        <!-- Loading -->
        <div v-if="loadingList" class="flex justify-center py-16">
            <div class="w-8 h-8 border-4 border-gray-200 border-t-brand rounded-full animate-spin"></div>
        </div>

        <!-- Error -->
        <div v-else-if="listError" class="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-5 py-4">
            {{ listError }}
            <button @click="reload" class="ml-3 underline font-semibold">Retry</button>
        </div>

        <!-- Empty -->
        <div v-else-if="quotations.length === 0" class="text-center py-20 text-gray-400">
            <p class="text-sm font-medium">ยังไม่มีใบเสนอราคา</p>
        </div>

        <!-- List -->
        <div v-else class="flex flex-col gap-4">
            <div
                v-for="q in quotations"
                :key="q.id"
                class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
                <!-- Header -->
                <div class="px-5 py-4 flex items-start justify-between gap-4 border-b border-gray-100">
                    <div>
                        <p class="font-semibold text-gray-900">{{ q.company?.name || '—' }}</p>
                        <p class="text-sm text-gray-500 mt-0.5">{{ q.company?.contact }} · {{ q.company?.phone }}</p>
                        <p class="text-sm text-gray-500">{{ q.company?.email }}</p>
                    </div>
                    <div class="text-right shrink-0">
                        <span class="inline-block text-xs font-semibold px-2.5 py-1 rounded-full"
                            :class="q.status === 'reviewed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
                        >{{ q.status === 'reviewed' ? 'ตรวจสอบแล้ว' : 'รอดำเนินการ' }}</span>
                        <p class="text-xs text-gray-400 mt-1">{{ formatDate(q.createdAt) }}</p>
                    </div>
                </div>

                <!-- Products -->
                <div class="px-5 py-4 flex flex-col gap-3">
                    <div
                        v-for="(p, i) in q.products"
                        :key="i"
                        class="flex items-start gap-3"
                    >
                        <img
                            v-if="p.refProductImageUrl"
                            :src="p.refProductImageUrl"
                            class="w-12 h-12 rounded-lg object-cover shrink-0 bg-gray-100"
                        />
                        <div class="w-12 h-12 rounded-lg bg-gray-100 shrink-0 flex items-center justify-center" v-else>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-brand truncate">{{ p.refProductName || 'สินค้าที่ ' + (i + 1) }}</p>
                            <p class="text-sm text-gray-600 mt-0.5">{{ p.description }}</p>
                            <p class="text-xs text-gray-400 mt-0.5">จำนวน {{ p.quantity }} ชิ้น</p>
                        </div>
                    </div>

                    <!-- Note -->
                    <div v-if="q.note" class="mt-1 px-3 py-2 bg-gray-50 rounded-lg">
                        <p class="text-xs font-semibold text-gray-500 mb-0.5">หมายเหตุ</p>
                        <p class="text-sm text-gray-600">{{ q.note }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useQuotationStore } from '../../stores/quotation'

export default {
    name: 'AdminQuotations',
    computed: {
        quotations()  { return useQuotationStore().quotations },
        loadingList() { return useQuotationStore().loadingList },
        listError()   { return useQuotationStore().listError },
    },
    mounted() {
        useQuotationStore().fetchQuotations()
    },
    methods: {
        reload() {
            useQuotationStore().fetchQuotations()
        },
        formatDate(ts) {
            if (!ts) return '—'
            const d = ts.toDate ? ts.toDate() : new Date(ts)
            return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        },
    },
}
</script>

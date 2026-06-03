<template>
    <AdminLayout>
        <div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">

            <!-- Page header + search -->
            <div class="px-8 py-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 class="text-xl font-bold text-slate-900">Quotations</h2>
                    <p class="text-sm text-slate-500 mt-1">Review customer quotation requests.</p>
                </div>
                <div class="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        v-model="search"
                        type="text"
                        placeholder="Search by order no. or product..."
                        class="pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:bg-white transition-all w-72"
                    />
                </div>
            </div>

            <!-- Error -->
            <div v-if="listError" class="mx-8 mt-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-5 py-3 flex items-center justify-between">
                <span>{{ listError }}</span>
                <button @click="reload" class="text-red-600 font-semibold underline text-sm ml-4">Retry</button>
            </div>

            <!-- Loading -->
            <div v-if="loadingList" class="flex justify-center py-16">
                <LoadingSpinner :admin="true" />
            </div>

            <!-- Empty -->
            <div v-else-if="filtered.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
                <p class="text-sm text-slate-400">{{ search ? 'No results found.' : 'No quotations yet.' }}</p>
            </div>

            <!-- Cards -->
            <div v-else class="px-8 py-6 flex flex-col gap-4">
                <div v-for="q in filtered" :key="q.id" class="border border-slate-200 rounded-2xl overflow-hidden">

                    <!-- Card header: quotation no + status + date -->
                    <div class="px-5 pt-4 pb-3 flex items-start justify-between gap-4 bg-slate-50 border-b border-slate-200">
                        <div>
                            <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Quotation No.</p>
                            <div class="flex items-center gap-2 mt-0.5">
                                <span class="text-sm font-bold text-brand">#{{ q.id.slice(0, 13).toUpperCase() }}</span>
                                <button @click="copyId(q.id)" class="text-[10px] text-slate-400 border border-slate-200 rounded px-1.5 py-0.5 hover:bg-white transition-colors">
                                    {{ copied === q.id ? '✓' : 'Copy' }}
                                </button>
                            </div>
                        </div>
                        <div class="text-right shrink-0 flex flex-col items-end gap-1.5">
                            <div class="relative">
                                <button @click.stop="toggleDropdown(q.id)"
                                    class="flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full transition-opacity hover:opacity-80"
                                    :class="{
                                        'bg-emerald-100 text-emerald-700': q.status === 'approved',
                                        'bg-red-100 text-red-600':         q.status === 'rejected',
                                        'bg-amber-100 text-amber-700':     q.status === 'pending' || !q.status,
                                    }"
                                >
                                    {{ statusLabel(q.status) }}
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <div v-if="openDropdown === q.id"
                                    class="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden min-w-[130px]">
                                    <button v-for="opt in statusOptions" :key="opt.value"
                                        @click.stop="selectStatus(q.id, opt.value)"
                                        class="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-left hover:bg-slate-50 transition-colors"
                                        :class="{
                                            'text-emerald-600': opt.value === 'approved',
                                            'text-red-500':     opt.value === 'rejected',
                                            'text-slate-600':   opt.value === 'pending',
                                        }"
                                    >
                                        <svg v-if="q.status === opt.value" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span v-else class="w-3.5 shrink-0"></span>
                                        {{ opt.label }}
                                    </button>
                                </div>
                            </div>
                            <p class="text-xs text-slate-400">{{ formatDate(q.createdAt) }}</p>
                        </div>
                    </div>

                    <!-- Company info -->
                    <div class="px-5 py-3 border-b border-slate-100 flex flex-col gap-1">
                        <div class="flex items-baseline gap-2">
                            <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wide w-20 shrink-0">Company</span>
                            <span class="text-sm font-semibold text-slate-800">{{ q.company?.name || '—' }}</span>
                        </div>
                        <div class="flex items-baseline gap-2">
                            <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wide w-20 shrink-0">Name</span>
                            <span class="text-sm text-slate-600">{{ q.company?.contact || '—' }}</span>
                        </div>
                        <div class="flex items-baseline gap-2">
                            <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wide w-20 shrink-0">Tel</span>
                            <span class="text-sm text-slate-600">{{ q.company?.phone || '—' }}</span>
                        </div>
                        <div class="flex items-baseline gap-2">
                            <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wide w-20 shrink-0">Email</span>
                            <span class="text-sm text-slate-600">{{ q.company?.email || '—' }}</span>
                        </div>
                    </div>

                    <!-- First product preview (always visible) -->
                    <div class="px-5 py-3 flex items-start gap-3">
                        <div class="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100 flex items-center justify-center">
                            <img v-if="q.products[0].refProductImageUrl" :src="q.products[0].refProductImageUrl" class="w-full h-full object-cover" />
                            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-semibold text-slate-900 truncate">{{ q.products[0].refProductName || q.products[0].description }}</p>
                            <p v-if="q.products[0].refProductVariantLabel" class="text-xs text-slate-400 mt-0.5">variant : {{ q.products[0].refProductVariantLabel }}</p>
                            <p v-if="q.products[0].refProductName && q.products[0].description" class="text-xs text-slate-400 mt-0.5">description : {{ q.products[0].description }}</p>
                            <p class="text-xs text-slate-400 mt-0.5">จำนวน : {{ q.products[0].quantity }}</p>
                        </div>
                    </div>

                    <!-- Item count (hidden when expanded) -->
                    <div v-if="!expanded[q.id]" class="px-5 pb-3 text-right">
                        <p class="text-xs text-slate-400">{{ q.products.length }} item{{ q.products.length === 1 ? '' : 's' }} total</p>
                    </div>

                    <!-- Expanded: items 2+ and note -->
                    <template v-if="expanded[q.id]">
                        <div class="border-t border-slate-100 px-5 pb-3 flex flex-col gap-3">
                            <div v-for="(p, i) in q.products.slice(1)" :key="i" class="flex items-start gap-3 pt-3">
                                <div class="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100 flex items-center justify-center">
                                    <img v-if="p.refProductImageUrl" :src="p.refProductImageUrl" class="w-full h-full object-cover" />
                                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-semibold text-slate-900 truncate">{{ p.refProductName || p.description }}</p>
                                    <p v-if="p.refProductVariantLabel" class="text-xs text-slate-400 mt-0.5">variant : {{ p.refProductVariantLabel }}</p>
                                    <p v-if="p.refProductName && p.description" class="text-xs text-slate-400 mt-0.5">description : {{ p.description }}</p>
                                    <p class="text-xs text-slate-400 mt-0.5">จำนวน : {{ p.quantity }}</p>
                                </div>
                            </div>
                            <div v-if="q.note" class="bg-slate-50 rounded-xl px-3 py-2.5 mt-1 border border-slate-100">
                                <p class="text-xs font-semibold text-slate-500 mb-0.5">Note</p>
                                <p class="text-sm text-slate-600">{{ q.note }}</p>
                            </div>
                        </div>
                    </template>

                    <!-- Expand toggle -->
                    <button
                        v-if="q.products.length > 1 || q.note"
                        @click="toggle(q.id)"
                        class="w-full border-t border-slate-100 py-3 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-400 hover:bg-slate-50 transition-colors"
                    >
                        <span>{{ expanded[q.id] ? 'Hide details' : 'Show more' }}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 transition-transform duration-200"
                            :class="expanded[q.id] ? 'rotate-180' : ''"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                </div>
            </div>

            <!-- Footer -->
            <div class="px-8 py-6 bg-slate-50 border-t border-slate-200">
                <p class="text-sm text-slate-500 font-medium">{{ filtered.length }} quotation{{ filtered.length === 1 ? '' : 's' }}{{ search ? ' found' : ' total' }}</p>
            </div>
        </div>
    </AdminLayout>
</template>

<script>
import AdminLayout from '../../components/admin/AdminLayout.vue'
import LoadingSpinner from '../../components/LoadingSpinner.vue'
import { formatDate } from '../../utils/formatDate'
import { useQuotationStore } from '../../stores/quotation'

export default {
    name: 'AdminQuotations',
    components: {
        AdminLayout,
        LoadingSpinner,
    },
    data() {
        return {
            search: '',
            expanded: {},
            copied: null,
            openDropdown: null,
            statusOptions: [
                { value: 'pending',  label: 'Pending'  },
                { value: 'approved', label: 'Approve'  },
                { value: 'rejected', label: 'Reject'   },
            ],
        }
    },
    mounted() {
        this._closeDropdown = () => { this.openDropdown = null }
        window.addEventListener('click', this._closeDropdown)
    },
    beforeUnmount() {
        window.removeEventListener('click', this._closeDropdown)
    },
    computed: {
        loadingList() { return useQuotationStore().loadingList },
        listError()   { return useQuotationStore().listError },
        filtered() {
            const all = useQuotationStore().quotations
            if (!this.search.trim()) return all
            const q = this.search.toLowerCase()
            return all.filter((qt) =>
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
        useQuotationStore().fetchQuotations()
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
        toggleDropdown(id) {
            this.openDropdown = this.openDropdown === id ? null : id
        },
        selectStatus(id, status) {
            useQuotationStore().updateQuotationStatus(id, status)
            this.openDropdown = null
        },
        statusLabel(status) {
            return { approved: 'Approved', rejected: 'Rejected', pending: 'Pending' }[status] || 'Pending'
        },
        reload() {
            useQuotationStore().fetchQuotations()
        },
        formatDate,
    },
}
</script>

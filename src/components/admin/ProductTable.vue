<template>
    <div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="px-8 py-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h2 class="text-xl font-bold text-slate-900">Products</h2>
                <p class="text-sm text-slate-500 mt-1">Manage your store products and stock.</p>
            </div>
            <div class="flex items-center gap-3">
                <select
                    v-model="filterCategory"
                    class="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#005c3d] focus:bg-white transition-all"
                >
                    <option value="">All Categories</option>
                    <option v-for="cat in categoryOptions" :key="cat" :value="cat">{{ cat }}</option>
                </select>
                <div class="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        v-model="search"
                        type="text"
                        placeholder="Search products..."
                        class="pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#005c3d] focus:bg-white transition-all w-56"
                    />
                </div>
                <button
                    @click="showForm = true"
                    class="bg-[#005c3d] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#004d33] transition-all transform active:scale-95"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Product
                </button>
            </div>
        </div>

        <div v-if="error" class="mx-8 mt-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-5 py-3 flex items-center justify-between">
            <span>{{ error }}</span>
            <button @click="reload" class="text-red-600 font-semibold underline text-sm ml-4">Retry</button>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-slate-50">
                        <th class="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                        <th class="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                        <th class="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                        <th class="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
                        <th class="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Variants</th>
                        <th class="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    <tr v-if="productsLoading">
                        <td colspan="6" class="px-8 py-16 text-center">
                            <div class="flex justify-center">
                                <LoadingSpinner :admin="true" />
                            </div>
                        </td>
                    </tr>
                    <tr v-else-if="!productsLoading && products.length === 0">
                        <td colspan="6" class="px-8 py-16 text-center text-slate-400 text-sm">No products yet.</td>
                    </tr>
                    <tr v-for="product in products" :key="product.id" class="hover:bg-slate-50/50 transition-colors group">
                        <td class="px-8 py-5">
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden">
                                    <img :src="product.imageUrl || '/images/mask.png'" :alt="product.title" class="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p class="font-bold text-slate-900 group-hover:text-[#005c3d] transition-colors">{{ product.title }}</p>
                                    <p class="text-xs text-slate-500 mt-0.5 line-clamp-1 max-w-[200px]">{{ product.description }}</p>
                                </div>
                            </div>
                        </td>
                        <td class="px-8 py-5">
                            <span class="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                                {{ product.category || 'Uncategorized' }}
                            </span>
                        </td>
                        <td class="px-8 py-5">
                            <span :class="[
                                'px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider',
                                product.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                            ]">
                                {{ product.isActive ? 'Active' : 'Inactive' }}
                            </span>
                        </td>
                        <td class="px-8 py-5">
                            <span class="font-bold text-slate-900">฿{{ product.displayPrice?.toFixed(2) ?? '0.00' }}</span>
                        </td>
                        <td class="px-8 py-5">
                            <details class="group cursor-pointer" v-if="product.variants?.length">
                                <summary class="text-xs font-bold text-[#005c3d] hover:underline list-none flex items-center gap-1 focus:outline-none">
                                    {{ product.variants.length }} variant{{ product.variants.length === 1 ? '' : 's' }}
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                                    </svg>
                                </summary>
                                <div class="mt-2.5 space-y-1.5">
                                    <div v-for="variant in product.variants" :key="variant.id" class="flex items-center justify-between gap-3 text-xs text-slate-600 border-l-[3px] border-slate-200 pl-2">
                                        <span class="truncate max-w-[120px] font-medium" :title="variant.optionValues?.length ? variant.optionValues.join(' - ') : 'Default'">
                                            {{ variant.optionValues?.length ? variant.optionValues.join(' - ') : 'Default' }}
                                        </span>
                                        <span class="font-bold bg-slate-100 px-1.5 py-0.5 rounded">{{ variant.stock || 0 }}</span>
                                    </div>
                                </div>
                            </details>
                            <span v-else class="text-xs font-bold text-slate-400">0 variants</span>
                        </td>
                        <td class="px-8 py-5 text-right sm:text-left">
                            <div class="flex items-center gap-2">
                                <button @click="openEdit(product)" class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button @click="confirmDelete(product)" class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="px-8 py-6 bg-slate-50 flex items-center justify-between border-t border-slate-200">
            <p class="text-sm text-slate-500 font-medium">Showing 1 to {{ products.length }} of {{ products.length }} entries</p>
            <div class="flex items-center gap-2">
                <button class="p-2 rounded-lg border border-slate-200 bg-white text-slate-400 disabled:opacity-50" disabled>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button class="w-10 h-10 rounded-lg bg-[#005c3d] text-white font-bold text-sm">1</button>
                <button class="p-2 rounded-lg border border-slate-200 bg-white text-slate-400 disabled:opacity-50" disabled>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>

        <ProductForm
            v-if="showForm"
            :editing-product="editingProduct"
            @close="closeModal"
            @saved="closeModal"
        />
    </div>
</template>

<script>
import { useProductsStore } from '../../stores/products'
import { CATEGORIES } from '../../constants/categories'
import LoadingSpinner from '../LoadingSpinner.vue'
import ProductForm from './ProductForm.vue'

export default {
    name: 'ProductTable',
    components: {
        LoadingSpinner,
        ProductForm,
    },
    data() {
        return {
            showForm: false,
            search: '',
            filterCategory: '',
            editingProduct: null,
        }
    },
    computed: {
        products() {
            let all = useProductsStore().products
            if (this.filterCategory) {
                all = all.filter((p) => p.category === this.filterCategory)
            }
            if (!this.search.trim()) return all
            const q = this.search.toLowerCase()
            return all.filter((p) => p.title.toLowerCase().includes(q))
        },
        categoryOptions() {
            return CATEGORIES
        },
        productsLoading() {
            return useProductsStore().loading
        },
        error() {
            return useProductsStore().error
        },
    },
    mounted() {
        useProductsStore().getProducts()
    },
    methods: {
        reload() {
            useProductsStore().getProducts()
        },
        openEdit(product) {
            this.editingProduct = product
            this.showForm = true
        },
        async confirmDelete(product) {
            if (!confirm(`Delete "${product.title}"?`)) return
            await useProductsStore().deleteProduct(product.id)
        },
        closeModal() {
            this.showForm = false
            this.editingProduct = null
        },
    },
}
</script>

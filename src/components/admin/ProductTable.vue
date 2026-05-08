<template>
    <div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="px-8 py-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h2 class="text-xl font-bold text-slate-900">Products</h2>
                <p class="text-sm text-slate-500 mt-1">Manage your store products and stock.</p>
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

        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-slate-50">
                        <th class="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                        <th class="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                        <th class="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
                        <th class="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Stock</th>
                        <th class="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    <tr v-for="(product, index) in products" :key="product.id" class="hover:bg-slate-50/50 transition-colors group">
                        <td class="px-8 py-5">
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden">
                                    <img v-if="index % 2 === 0" src="/images/mask.png" alt="" class="w-full h-full object-cover" />
                                    <img v-else src="/images/gloves.png" alt="" class="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p class="font-bold text-slate-900 group-hover:text-[#005c3d] transition-colors">{{ product.title }}</p>
                                    <p class="text-xs text-slate-500 mt-0.5 line-clamp-1 max-w-[200px]">{{ product.description }}</p>
                                </div>
                            </div>
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
                            <span class="font-bold text-slate-900">฿{{ product.price.toFixed(2) }}</span>
                        </td>
                        <td class="px-8 py-5">
                            <div class="flex items-center gap-2">
                                <div class="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                    <div :class="[
                                        'h-full rounded-full',
                                        product.isActive ? 'w-2/3 bg-[#005c3d]' : 'w-0'
                                    ]"></div>
                                </div>
                                <span class="text-xs font-bold text-slate-600">{{ product.isActive ? 42 : 0 }}</span>
                            </div>
                        </td>
                        <td class="px-8 py-5 text-right sm:text-left">
                            <div class="flex items-center gap-2">
                                <button class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
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

        <!-- Add Product Modal -->
        <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-black/40" @click="closeForm"></div>
            <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-bold text-slate-900">Add Product</h3>
                    <button @click="closeForm" class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form @submit.prevent="submitForm" class="space-y-5">
                    <div>
                        <label class="block text-sm font-semibold text-slate-700 mb-1.5">Title</label>
                        <input
                            v-model="form.title"
                            type="text"
                            required
                            class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#005c3d] focus:border-transparent"
                            placeholder="Product title"
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                        <textarea
                            v-model="form.description"
                            rows="3"
                            class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#005c3d] focus:border-transparent resize-none"
                            placeholder="Product description"
                        ></textarea>
                    </div>

                    <div>
                        <label class="block text-sm font-semibold text-slate-700 mb-1.5">Price (฿)</label>
                        <input
                            v-model.number="form.price"
                            type="number"
                            min="0"
                            step="0.01"
                            required
                            class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#005c3d] focus:border-transparent"
                            placeholder="0.00"
                        />
                    </div>

                    <div class="flex items-center gap-3">
                        <button
                            type="button"
                            @click="form.isActive = !form.isActive"
                            :class="[
                                'relative w-11 h-6 rounded-full transition-colors',
                                form.isActive ? 'bg-[#005c3d]' : 'bg-slate-200'
                            ]"
                        >
                            <span :class="[
                                'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
                                form.isActive ? 'translate-x-5' : 'translate-x-0'
                            ]"></span>
                        </button>
                        <span class="text-sm font-semibold text-slate-700">Active</span>
                    </div>

                    <div class="flex gap-3 pt-2">
                        <button
                            type="button"
                            @click="closeForm"
                            class="flex-1 px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            :disabled="loading"
                            class="flex-1 px-6 py-3 rounded-xl bg-[#005c3d] text-white font-bold text-sm hover:bg-[#004d33] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                        >
                            {{ loading ? 'Saving...' : 'Save Product' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { useProductsStore } from '../../stores/products'

export default {
    name: 'ProductTable',
    data() {
        return {
            showForm: false,
            loading: false,
            form: {
                title: '',
                description: '',
                price: null,
                isActive: true,
            },
        }
    },
    computed: {
        products() {
            return useProductsStore().products
        },
    },
    mounted() {
        useProductsStore().getProducts()
    },
    methods: {
        async submitForm() {
            this.loading = true
            await useProductsStore().createProduct(this.form)
            this.loading = false
            this.closeForm()
        },
        closeForm() {
            this.showForm = false
            this.form = { title: '', description: '', price: null, isActive: true }
        },
    },
}
</script>

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
                        <th class="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Variants</th>
                        <th class="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
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
                            <span :class="[
                                'px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider',
                                product.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                            ]">
                                {{ product.isActive ? 'Active' : 'Inactive' }}
                            </span>
                        </td>
                        <td class="px-8 py-5">
                            <span class="font-bold text-slate-900">฿{{ product.displayPrice.toFixed(2) }}</span>
                        </td>
                        <td class="px-8 py-5">
                            <span class="text-xs font-bold text-slate-600">{{ product.variants.length }} variant{{ product.variants.length === 1 ? '' : 's' }}</span>
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

        <!-- Add / Edit Product Modal -->
        <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-black/40" @click="closeForm"></div>
            <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-y-auto max-h-[90vh]">
                <div class="px-8 pt-8 pb-4 flex items-center justify-between sticky top-0 bg-white z-10 border-b border-slate-100">
                    <h3 class="text-xl font-bold text-slate-900">{{ editingProduct ? 'Edit Product' : 'Add Product' }}</h3>
                    <button @click="closeForm" class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form @submit.prevent="submitForm" class="px-8 py-6 space-y-5">
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
                        <label class="block text-sm font-semibold text-slate-700 mb-1.5">Cover Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            @change="coverImageFile = $event.target.files[0]"
                            class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#005c3d] focus:border-transparent file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#005c3d] file:text-white"
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

                    <!-- Option Groups -->
                    <div class="border-t border-slate-100 pt-5">
                        <div class="flex items-center justify-between mb-3">
                            <label class="text-sm font-semibold text-slate-700">Options</label>
                            <button
                                type="button"
                                @click="addOptionGroup"
                                class="text-xs font-semibold text-[#005c3d] hover:underline"
                            >+ Add Option</button>
                        </div>
                        <div v-for="(group, gi) in form.optionGroups" :key="gi" class="flex gap-2 mb-2">
                            <input
                                v-model="group.name"
                                type="text"
                                placeholder="Name (e.g. Size)"
                                class="w-28 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#005c3d]"
                            />
                            <input
                                v-model="group.optionsText"
                                type="text"
                                placeholder="S, M, L"
                                class="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#005c3d]"
                            />
                            <button type="button" @click="removeOptionGroup(gi)" class="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <button
                            v-if="form.optionGroups.length > 0"
                            type="button"
                            @click="generateVariants"
                            class="mt-1 text-xs font-semibold text-white bg-slate-600 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
                        >Generate Variants</button>
                    </div>

                    <!-- Variants Pricing -->
                    <div v-if="form.variants.length > 0">
                        <label class="block text-sm font-semibold text-slate-700 mb-3">Pricing &amp; Stock</label>
                        <div class="space-y-2">
                            <div class="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider pb-1">
                                <span class="flex-1">Variant</span>
                                <span class="w-24 text-center">Price (฿)</span>
                                <span class="w-20 text-center">Stock</span>
                            </div>
                            <div v-for="(variant, vi) in form.variants" :key="vi" class="flex items-center gap-2">
                                <span class="text-sm text-slate-700 flex-1 min-w-0 truncate font-medium">
                                    {{ variant.optionValues.length > 0 ? variant.optionValues.join(' / ') : 'Default' }}
                                </span>
                                <input
                                    v-model.number="variant.price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    required
                                    placeholder="0.00"
                                    class="w-24 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#005c3d] text-right"
                                />
                                <input
                                    v-model.number="variant.stock"
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    class="w-20 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#005c3d] text-right"
                                />
                            </div>
                        </div>
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
                            {{ loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Save Product' }}
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
            editingProduct: null,
            coverImageFile: null,
            form: {
                title: '',
                description: '',
                isActive: true,
                optionGroups: [],
                variants: [{ id: 'default', optionValues: [], price: null, stock: 0 }],
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
        addOptionGroup() {
            this.form.optionGroups.push({ name: '', optionsText: '' })
        },
        removeOptionGroup(index) {
            this.form.optionGroups.splice(index, 1)
            if (this.form.optionGroups.length === 0) {
                this.form.variants = [{ id: 'default', optionValues: [], price: null, stock: 0 }]
            }
        },
        generateVariants() {
            const groups = this.form.optionGroups.map((g) =>
                g.optionsText.split(',').map((o) => o.trim()).filter(Boolean)
            )
            if (groups.some((g) => g.length === 0)) return
            const combos = groups.reduce(
                (acc, opts) => acc.flatMap((combo) => opts.map((opt) => [...combo, opt])),
                [[]]
            )
            const existing = {}
            this.form.variants.forEach((v) => { existing[v.id] = { price: v.price, stock: v.stock } })
            this.form.variants = combos.map((combo) => {
                const id = combo.join('_')
                return { id, optionValues: combo, price: existing[id]?.price ?? null, stock: existing[id]?.stock ?? 0 }
            })
        },
        openEdit(product) {
            this.editingProduct = product
            this.form = {
                title: product.title,
                description: product.description,
                isActive: product.isActive,
                optionGroups: (product.optionGroups || []).map((g) => ({
                    name: g.name,
                    optionsText: g.options.join(', '),
                })),
                variants: (product.variants || []).map((v) => ({
                    id: v.id,
                    optionValues: v.optionValues || [],
                    price: v.price,
                    stock: v.stock ?? 0,
                    imagePath: v.imagePath || null,
                })),
            }
            this.showForm = true
        },
        async confirmDelete(product) {
            if (!confirm(`Delete "${product.title}"?`)) return
            await useProductsStore().deleteProduct(product.id)
        },
        async submitForm() {
            this.loading = true
            const store = useProductsStore()
            let coverImagePath = this.editingProduct
                ? (this.editingProduct.coverImagePath || this.editingProduct.imagePath || null)
                : null
            if (this.coverImageFile) {
                coverImagePath = await store.uploadProductImage(this.coverImageFile)
            }
            const optionGroups = this.form.optionGroups.map((g) => ({
                name: g.name,
                options: g.optionsText.split(',').map((o) => o.trim()).filter(Boolean),
            }))
            const payload = {
                title: this.form.title,
                description: this.form.description,
                isActive: this.form.isActive,
                coverImagePath,
                optionGroups,
                variants: this.form.variants,
            }
            if (this.editingProduct) {
                await store.updateProduct(this.editingProduct.id, payload)
            } else {
                await store.createProduct(payload)
            }
            this.loading = false
            this.closeForm()
        },
        closeForm() {
            this.showForm = false
            this.editingProduct = null
            this.coverImageFile = null
            this.form = {
                title: '',
                description: '',
                isActive: true,
                optionGroups: [],
                variants: [{ id: 'default', optionValues: [], price: null, stock: 0 }],
            }
        },
    },
}
</script>

<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="closeForm"></div>
        <div class="relative bg-slate-50 rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col max-h-full overflow-hidden">

            <!-- Header -->
            <div class="px-8 py-5 bg-white flex items-center justify-between border-b border-slate-200 shrink-0">
                <h3 class="text-xl font-bold text-slate-900">{{ editingProduct ? 'Edit Product' : 'Add New Product' }}</h3>
                <button @click="closeForm" class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Body -->
            <div class="flex-1 overflow-y-auto p-4 sm:p-8">
                <div class="max-w-4xl mx-auto space-y-6">

                    <!-- Basic Info Card -->
                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">
                        <h4 class="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Basic Information</h4>

                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Product Name</label>
                            <input v-model="form.title" type="text" required placeholder="Enter product name..." class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all" :class="{ 'border-red-400': errors.title }" />
                            <p v-if="errors.title" class="text-red-500 text-xs mt-1">{{ errors.title }}</p>
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                            <textarea v-model="form.description" rows="4" placeholder="Enter product description..." class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent resize-none transition-all"></textarea>
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-2">Categories</label>
                            <div class="flex flex-col sm:flex-row gap-2">
                                <select v-model="selectedCategory" class="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all" :class="{ 'border-red-400': errors.categories }">
                                    <option value="">— Select category —</option>
                                    <option v-for="cat in categoryOptions" :key="cat" :value="cat">{{ cat }}</option>
                                </select>
                                <button type="button" @click="addCategory" class="px-5 py-3 rounded-xl bg-slate-800 text-white text-sm font-bold hover:bg-slate-700 transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed" :disabled="!selectedCategory">
                                    Add
                                </button>
                            </div>
                            <div v-if="form.categories.length" class="flex flex-wrap gap-2 mt-3">
                                <span
                                    v-for="(cat, index) in form.categories"
                                    :key="`${cat}-${index}`"
                                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand/10 text-brand text-sm font-semibold border border-brand/20"
                                >
                                    {{ cat }}
                                    <button type="button" @click="removeCategory(index)" class="hover:text-red-600 focus:outline-none" aria-label="Remove category">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </span>
                            </div>
                            <p v-if="errors.categories" class="text-red-500 text-xs mt-1">{{ errors.categories }}</p>
                            <p class="text-xs text-slate-400 mt-2">Use Add for each category. Leave empty if this product has no category.</p>
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Weight (grams)</label>
                            <div class="flex items-center gap-2">
                                <input v-model.number="form.weight" type="number" min="0" placeholder="e.g. 500" class="w-40 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all" />
                                <span class="text-sm text-slate-500">g</span>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Dimensions (cm)</label>
                            <div class="flex items-center gap-2">
                                <div class="flex flex-col items-center gap-1">
                                    <input v-model.number="form.dimensionLength" type="number" min="0" placeholder="0" class="w-24 px-3 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm text-center focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all" />
                                    <span class="text-xs text-slate-400">Length</span>
                                </div>
                                <span class="text-slate-400 mb-4">×</span>
                                <div class="flex flex-col items-center gap-1">
                                    <input v-model.number="form.dimensionWidth" type="number" min="0" placeholder="0" class="w-24 px-3 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm text-center focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all" />
                                    <span class="text-xs text-slate-400">Width</span>
                                </div>
                                <span class="text-slate-400 mb-4">×</span>
                                <div class="flex flex-col items-center gap-1">
                                    <input v-model.number="form.dimensionHeight" type="number" min="0" placeholder="0" class="w-24 px-3 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm text-center focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all" />
                                    <span class="text-xs text-slate-400">Height</span>
                                </div>
                                <span class="text-sm text-slate-500 mb-4">cm</span>
                            </div>
                        </div>

                        <div class="flex items-center gap-3 pt-2">
                            <button type="button" @click="form.isActive = !form.isActive" :class="['relative w-12 h-6 rounded-full transition-colors focus:outline-none', form.isActive ? 'bg-brand' : 'bg-slate-300']">
                                <span :class="['absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform', form.isActive ? 'translate-x-6' : 'translate-x-0']"></span>
                            </button>
                            <span class="text-sm font-semibold text-slate-700">Product is {{ form.isActive ? 'Active' : 'Hidden' }}</span>
                        </div>
                    </div>

                    <!-- Media Card -->
                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">
                        <h4 class="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Product Media</h4>
                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-2">Cover Image</label>
                            <div class="flex items-start gap-6">
                                <div class="w-32 h-32 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden relative group shrink-0">
                                    <img v-if="coverImagePreview" :src="coverImagePreview" class="w-full h-full object-cover" />
                                    <div v-else class="flex flex-col items-center text-slate-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        <span class="text-xs font-semibold">Upload</span>
                                    </div>
                                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                        <span class="text-white text-xs font-bold">Change</span>
                                    </div>
                                    <input type="file" accept="image/*" @change="handleCoverImage" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                                </div>
                                <div class="flex-1 text-sm text-slate-500 mt-2">
                                    <p>This is the main image shown on the product list.</p>
                                    <p class="mt-1">Recommended size: 800x800px. JPG, PNG or WEBP.</p>
                                </div>
                            </div>
                        </div>

                        <!-- Detail Images -->
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <label class="block text-sm font-semibold text-slate-700">Detail Images</label>
                                <span class="text-xs text-slate-400">{{ detailImages.length }} / 5</span>
                            </div>
                            <div class="flex flex-wrap gap-3">
                                <!-- Existing / newly added thumbnails -->
                                <div
                                    v-for="(img, i) in detailImages"
                                    :key="i"
                                    class="relative w-20 h-20 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 group shrink-0"
                                >
                                    <img :src="img.preview" class="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        @click="removeDetailImage(i)"
                                        class="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <!-- Add button -->
                                <label
                                    v-if="detailImages.length < 5"
                                    class="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:border-brand hover:text-brand transition-colors shrink-0"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span class="text-[10px] font-semibold">Add</span>
                                    <input type="file" accept="image/*" @change="handleDetailImage" class="hidden" />
                                </label>
                            </div>
                            <p class="text-xs text-slate-400 mt-2">Shown in the product detail carousel after the cover image. Max 5.</p>
                        </div>
                    </div>

                    <!-- Sales Info Card -->
                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h4 class="text-base font-bold text-slate-900">Sales Information</h4>
                        </div>

                        <!-- Option Groups Builder -->
                        <div class="space-y-4 bg-slate-50/50 rounded-xl p-5 border border-slate-200">
                            <h5 class="text-sm font-bold text-slate-800">Variations</h5>

                            <div v-for="(group, gi) in form.optionGroups" :key="gi" class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative">
                                <button type="button" @click="removeOptionGroup(gi)" class="absolute top-3 right-3 text-slate-400 hover:text-red-500 p-1 focus:outline-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>

                                <div class="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-4">
                                    <div>
                                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Variation Name</label>
                                        <input v-model="group.name" type="text" placeholder="e.g. Color, Size" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent" :class="{ 'border-red-400': errors.optionGroups[gi]?.name }" />
                                        <p v-if="errors.optionGroups[gi]?.name" class="text-red-500 text-xs mt-1">{{ errors.optionGroups[gi].name }}</p>
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Options</label>
                                        <div class="flex flex-wrap gap-2 mb-2" v-if="group.options.length > 0">
                                            <div v-for="(opt, oi) in group.options" :key="oi" class="flex items-center gap-1 bg-brand/10 text-brand px-3 py-1.5 rounded-lg text-sm font-semibold border border-brand/20">
                                                {{ opt }}
                                                <button type="button" @click="removeOption(gi, oi)" class="hover:text-red-600 ml-1 focus:outline-none">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                        <input v-model="group.newOption" @keydown.enter.prevent="addOption(gi)" type="text" placeholder="Type option & press Enter" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent" />
                                        <p v-if="errors.optionGroups[gi]?.options" class="text-red-500 text-xs mt-1">{{ errors.optionGroups[gi].options }}</p>
                                    </div>
                                </div>
                            </div>

                            <button type="button" @click="addOptionGroup" v-if="form.optionGroups.length < 2" class="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-100 focus:outline-none transition-colors flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                                Add Variation Group
                            </button>
                        </div>

                        <!-- Variants Table -->
                        <p v-if="errors.variants" class="text-red-500 text-xs">{{ errors.variants }}</p>
                        <div class="mt-6 border border-slate-200 rounded-xl overflow-hidden bg-white">
                            <div v-if="form.variants.length > 0 && form.optionGroups.length > 0" class="bg-slate-50 px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
                                <span class="text-sm font-bold text-slate-700">Batch Edit All Variants</span>
                                <div class="flex items-center gap-3">
                                    <input v-model.number="batch.price" type="number" min="0" placeholder="Price" class="w-24 px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
                                    <input v-model.number="batch.stock" type="number" min="0" placeholder="Stock" class="w-24 px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
                                    <button type="button" @click="applyBatch" class="px-4 py-1.5 bg-slate-800 text-white text-sm font-bold rounded-lg hover:bg-slate-700 transition-colors focus:outline-none">Apply All</button>
                                </div>
                            </div>

                            <div class="overflow-x-auto">
                                <table class="w-full text-left border-collapse">
                                    <thead class="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        <tr>
                                            <th class="px-4 py-3 border-b border-slate-100">Variant</th>
                                            <th class="px-4 py-3 border-b border-slate-100 text-center w-24">Image</th>
                                            <th class="px-4 py-3 border-b border-slate-100 text-right w-32">Price (฿)</th>
                                            <th class="px-4 py-3 border-b border-slate-100 text-right w-28">Stock</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-100 text-sm text-slate-800">
                                        <tr v-for="(variant, vi) in form.variants" :key="vi" class="hover:bg-slate-50 transition-colors">
                                            <td class="px-4 py-3 font-medium whitespace-nowrap">{{ variant.optionValues.length ? variant.optionValues.join(' - ') : 'Default' }}</td>
                                            <td class="px-4 py-3 text-center">
                                                <div class="w-10 h-10 mx-auto rounded border border-slate-200 bg-slate-100 flex items-center justify-center overflow-hidden relative group cursor-pointer">
                                                    <img v-if="variant.imagePreview || variant.imageUrl" :src="variant.imagePreview || variant.imageUrl" class="w-full h-full object-cover" />
                                                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                                                    </div>
                                                    <input type="file" accept="image/*" @change="handleVariantImage($event, vi)" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                                </div>
                                            </td>
                                            <td class="px-4 py-3">
                                                <input v-model.number="variant.price" type="number" min="0" step="0.01" required placeholder="0.00" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand text-right bg-white" :class="{ 'border-red-400': errors.variantRows[vi]?.price }" />
                                                <p v-if="errors.variantRows[vi]?.price" class="text-red-500 text-[10px] mt-0.5 text-right">{{ errors.variantRows[vi].price }}</p>
                                            </td>
                                            <td class="px-4 py-3">
                                                <input v-model.number="variant.stock" type="number" min="0" required placeholder="0" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand text-right bg-white" :class="{ 'border-red-400': errors.variantRows[vi]?.stock }" />
                                                <p v-if="errors.variantRows[vi]?.stock" class="text-red-500 text-[10px] mt-0.5 text-right">{{ errors.variantRows[vi].stock }}</p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <!-- Footer -->
            <div class="px-8 py-5 bg-white border-t border-slate-200 flex justify-end gap-3 shrink-0">
                <button type="button" @click="closeForm" class="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all focus:outline-none">
                    Cancel
                </button>
                <button type="button" @click="submitForm" :disabled="loading" class="px-8 py-2.5 rounded-xl bg-brand text-white font-bold text-sm hover:bg-brand-dark disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center gap-2 focus:outline-none">
                    <svg v-if="loading" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    {{ loading ? 'Saving...' : (editingProduct ? 'Save Changes' : 'Publish Product') }}
                </button>
            </div>

        </div>
    </div>
</template>

<script>
import { useProductsStore } from '../../stores/products'
import { CATEGORIES } from '../../constants/categories'

export default {
    name: 'ProductForm',
    props: {
        editingProduct: { type: Object, default: null },
    },
    emits: ['close', 'saved'],
    data() {
        return {
            loading: false,
            coverImageFile: null,
            coverImagePreview: null,
            detailImages: [],   // [{ file, preview, path }]
            selectedCategory: '',
            batch: { price: null, stock: null },
            errors: { title: '', categories: '', variants: '', variantRows: [], optionGroups: [] },
            form: {
                title: '',
                description: '',
                categories: [],
                isActive: true,
                weight: null,
                dimensionLength: null,
                dimensionWidth: null,
                dimensionHeight: null,
                optionGroups: [],
                variants: [{ id: 'default', optionValues: [], price: null, stock: 0, imageFile: null, imagePreview: null, imagePath: null, imageUrl: null }],
            },
        }
    },
    computed: {
        categoryOptions() {
            return CATEGORIES
        },
    },
    mounted() {
        if (this.editingProduct) {
            this.populateForm(this.editingProduct)
        }
    },
    methods: {
        populateForm(product) {
            this.coverImagePreview = product.imageUrl || null
            this.coverImageFile = null
            this.detailImages = (product.detailImagePaths || []).map((path, i) => ({
                file: null,
                preview: (product.detailImageUrls || [])[i] || null,
                path,
            }))
            this.selectedCategory = ''
            this.batch = { price: null, stock: null }
            this.form = {
                title: product.title || '',
                description: product.description || '',
                categories: Array.isArray(product.categories) ? [...product.categories] : (product.category ? [product.category] : []),
                isActive: product.isActive ?? true,
                weight: product.weight ?? null,
                dimensionLength: product.dimensionLength ?? null,
                dimensionWidth: product.dimensionWidth ?? null,
                dimensionHeight: product.dimensionHeight ?? null,
                optionGroups: (product.optionGroups || []).map(g => ({
                    name: g.name,
                    options: [...g.options],
                    newOption: ''
                })),
                variants: (product.variants || []).map(v => ({
                    id: v.id,
                    optionValues: v.optionValues ? [...v.optionValues] : [],
                    price: v.price,
                    stock: v.stock || 0,
                    imagePath: v.imagePath || null,
                    imageUrl: v.imageUrl || null,
                    imageFile: null,
                    imagePreview: null
                }))
            }
            if (this.form.variants.length === 0) {
                this.form.variants = [{ id: 'default', optionValues: [], price: null, stock: 0, imagePath: null, imageUrl: null, imageFile: null, imagePreview: null }]
            }
        },
        handleCoverImage(e) {
            const file = e.target.files[0]
            if (file) {
                this.coverImageFile = file
                this.coverImagePreview = URL.createObjectURL(file)
            }
        },
        handleDetailImage(e) {
            const file = e.target.files[0]
            if (!file || this.detailImages.length >= 5) return
            this.detailImages.push({ file, preview: URL.createObjectURL(file), path: null })
            e.target.value = ''
        },
        removeDetailImage(i) {
            this.detailImages.splice(i, 1)
        },
        handleVariantImage(e, vi) {
            const file = e.target.files[0]
            if (file) {
                this.form.variants[vi].imageFile = file
                this.form.variants[vi].imagePreview = URL.createObjectURL(file)
            }
        },
        addCategory() {
            if (!this.selectedCategory) return
            this.form.categories.push(this.selectedCategory)
            this.selectedCategory = ''
            this.errors.categories = ''
        },
        removeCategory(index) {
            this.form.categories.splice(index, 1)
            this.errors.categories = ''
        },
        addOptionGroup() {
            this.form.optionGroups.push({ name: '', options: [], newOption: '' })
            this.generateVariants()
        },
        removeOptionGroup(gi) {
            this.form.optionGroups.splice(gi, 1)
            this.generateVariants()
        },
        addOption(gi) {
            const text = this.form.optionGroups[gi].newOption.trim()
            if (text && !this.form.optionGroups[gi].options.includes(text)) {
                this.form.optionGroups[gi].options.push(text)
                this.generateVariants()
            }
            this.form.optionGroups[gi].newOption = ''
        },
        removeOption(gi, oi) {
            this.form.optionGroups[gi].options.splice(oi, 1)
            this.generateVariants()
        },
        applyBatch() {
            this.form.variants.forEach(v => {
                if (this.batch.price !== null && this.batch.price !== '') v.price = this.batch.price
                if (this.batch.stock !== null && this.batch.stock !== '') v.stock = this.batch.stock
            })
            this.batch = { price: null, stock: null }
        },
        generateVariants() {
            const groups = this.form.optionGroups.map(g => g.options).filter(opts => opts.length > 0)
            if (groups.length === 0) {
                const existingDefault = this.form.variants.find(v => v.id === 'default') || {}
                this.form.variants = [{
                    id: 'default',
                    optionValues: [],
                    price: existingDefault.price || null,
                    stock: existingDefault.stock || 0,
                    imageFile: existingDefault.imageFile || null,
                    imagePreview: existingDefault.imagePreview || null,
                    imagePath: existingDefault.imagePath || null,
                    imageUrl: existingDefault.imageUrl || null
                }]
                return
            }
            const combos = groups.reduce((acc, opts) => acc.flatMap(combo => opts.map(opt => [...combo, opt])), [[]])
            const existing = {}
            this.form.variants.forEach(v => { existing[v.id] = v })
            this.form.variants = combos.map(combo => {
                const id = combo.join(' - ')
                const ex = existing[id] || {}
                return {
                    id,
                    optionValues: combo,
                    price: ex.price !== undefined ? ex.price : null,
                    stock: ex.stock !== undefined ? ex.stock : 0,
                    imageFile: ex.imageFile || null,
                    imagePreview: ex.imagePreview || null,
                    imagePath: ex.imagePath || null,
                    imageUrl: ex.imageUrl || null
                }
            })
        },
        clearErrors() {
            this.errors = {
                title: '',
                categories: '',
                variants: '',
                variantRows: this.form.variants.map(() => ({ price: '', stock: '' })),
                optionGroups: this.form.optionGroups.map(() => ({ name: '', options: '' })),
            }
        },
        validate() {
            this.clearErrors()
            let valid = true
            if (!this.form.title.trim()) {
                this.errors.title = 'Product name is required.'
                valid = false
            }
            const uniqueCategories = new Set(this.form.categories)
            if (uniqueCategories.size !== this.form.categories.length) {
                this.errors.categories = 'Duplicate categories are not allowed.'
                valid = false
            }
            if (this.form.variants.length === 0) {
                this.errors.variants = 'At least one variant is required.'
                valid = false
            }
            this.form.variants.forEach((v, i) => {
                if (v.price == null || v.price === '' || Number(v.price) < 0) {
                    this.errors.variantRows[i].price = 'Required'
                    valid = false
                }
                if (v.stock == null || v.stock === '' || Number(v.stock) < 0) {
                    this.errors.variantRows[i].stock = 'Must be ≥ 0'
                    valid = false
                }
            })
            this.form.optionGroups.forEach((g, i) => {
                if (!g.name.trim()) {
                    this.errors.optionGroups[i].name = 'Variation name is required.'
                    valid = false
                }
                if (g.options.length === 0) {
                    this.errors.optionGroups[i].options = 'Add at least one option.'
                    valid = false
                }
            })
            return valid
        },
        async submitForm() {
            if (!this.validate()) return
            this.loading = true
            const store = useProductsStore()
            try {
                let coverImagePath = this.editingProduct ? (this.editingProduct.coverImagePath || this.editingProduct.imagePath || null) : null
                if (this.coverImageFile) {
                    coverImagePath = await store.uploadProductImage(this.coverImageFile)
                }
                const detailImagePaths = await Promise.all(
                    this.detailImages.map((img) =>
                        img.file ? store.uploadProductImage(img.file) : Promise.resolve(img.path)
                    )
                )
                const finalVariants = await Promise.all(this.form.variants.map(async (v) => {
                    let vImagePath = v.imagePath
                    if (v.imageFile) {
                        vImagePath = await store.uploadProductImage(v.imageFile)
                    }
                    return {
                        id: v.id,
                        optionValues: v.optionValues,
                        price: v.price || 0,
                        stock: v.stock || 0,
                        imagePath: vImagePath || null
                    }
                }))
                const optionGroups = this.form.optionGroups.map(g => ({
                    name: g.name || 'Variation',
                    options: g.options
                }))
                const payload = {
                    title: this.form.title,
                    description: this.form.description,
                    categories: this.form.categories,
                    isActive: this.form.isActive,
                    weight: this.form.weight || null,
                    dimensionLength: this.form.dimensionLength || null,
                    dimensionWidth: this.form.dimensionWidth || null,
                    dimensionHeight: this.form.dimensionHeight || null,
                    coverImagePath,
                    detailImagePaths,
                    optionGroups,
                    variants: finalVariants
                }
                if (this.editingProduct) {
                    await store.updateProduct(this.editingProduct.id, payload)
                } else {
                    await store.createProduct(payload)
                }
                this.$emit('saved')
            } catch (e) {
                console.error('Error saving product:', e)
                alert('Failed to save product. Please try again.')
            } finally {
                this.loading = false
            }
        },
        closeForm() {
            this.$emit('close')
        },
    },
}
</script>

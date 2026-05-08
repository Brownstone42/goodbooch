<template>
    <div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="px-8 py-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h2 class="text-xl font-bold text-slate-900">Products</h2>
                <p class="text-sm text-slate-500 mt-1">Manage your store products and stock.</p>
            </div>
            <button class="bg-[#005c3d] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#004d33] transition-all transform active:scale-95">
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
                    <tr v-for="product in products" :key="product.id" class="hover:bg-slate-50/50 transition-colors group">
                        <td class="px-8 py-5">
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden">
                                    <img v-if="product.id % 2 === 0" src="/images/mask.png" alt="" class="w-full h-full object-cover" />
                                    <img v-else src="/images/gloves.png" alt="" class="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p class="font-bold text-slate-900 group-hover:text-[#005c3d] transition-colors">{{ product.name }}</p>
                                    <p class="text-xs text-slate-500 mt-0.5 line-clamp-1 max-w-[200px]">{{ product.description }}</p>
                                </div>
                            </div>
                        </td>
                        <td class="px-8 py-5">
                            <span :class="[
                                'px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider',
                                product.id % 3 === 0 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                            ]">
                                {{ product.id % 3 === 0 ? 'Out of Stock' : 'Active' }}
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
                                        product.id % 3 === 0 ? 'w-0' : 'w-2/3 bg-[#005c3d]'
                                    ]"></div>
                                </div>
                                <span class="text-xs font-bold text-slate-600">{{ product.id % 3 === 0 ? 0 : 42 }}</span>
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
    </div>
</template>

<script>
import { useProductsStore } from '../../stores/products'

export default {
    name: 'ProductTable',
    computed: {
        products() {
            return useProductsStore().list
        }
    }
}
</script>

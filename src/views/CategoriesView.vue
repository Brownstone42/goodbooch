<template>
    <div class="bg-[#f8f9fa] pb-6">

        <!-- Quote mode banner -->
        <div v-if="isQuoteMode" class="bg-brand/10 border-b border-brand/20 px-4 py-2.5 flex items-center justify-between">
            <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-brand shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
                </svg>
                <span class="text-xs font-semibold text-brand">กำลังเลือกสินค้าอ้างอิง — แตะสินค้าเพื่อเลือก</span>
            </div>
            <button @click="$router.back()" class="text-xs text-gray-500 font-medium">ยกเลิก</button>
        </div>

        <!-- Category Pills -->
        <div class="pt-4 px-4">
            <div class="grid grid-cols-4 gap-2">
                <button
                    v-for="cat in categories"
                    :key="cat"
                    class="py-2 px-1 rounded-full text-[11px] font-medium text-center leading-tight transition-colors"
                    :class="cat === activeCategory ? 'bg-brand text-white' : 'bg-[#f1f3f5] text-gray-600'"
                    @click="activeCategory = cat"
                >
                    {{ cat }}
                </button>
            </div>
        </div>

        <!-- Section Title -->
        <div class="px-4 mt-5">
            <h3 class="text-base font-bold text-gray-800">{{ activeCategory }}</h3>
        </div>

        <!-- Product Grid -->
        <div class="px-4 mt-3">
            <div v-if="loading" class="flex justify-center items-center py-20">
                <LoadingSpinner />
            </div>
            <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl px-5 py-4 flex items-center justify-between">
                <span>{{ error }}</span>
                <button @click="retry" class="text-red-600 font-semibold underline text-sm ml-4">Retry</button>
            </div>
            <div v-else-if="products.length === 0" class="flex flex-col items-center justify-center py-20 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p class="text-sm font-medium">ไม่พบสินค้า</p>
            </div>
            <div v-else class="grid grid-cols-2 gap-3">
                <div
                    v-for="product in products"
                    :key="product.id"
                    class="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full"
                >
                    <div class="aspect-[1/1] bg-gray-50 relative">
                        <router-link :to="productPath(product.id)" class="block w-full h-full">
                            <img
                                :src="product.imageUrl || '/images/mask.png'"
                                :alt="product.title"
                                class="w-full h-full object-cover"
                            />
                        </router-link>
                        <button v-if="!isQuoteMode" class="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                    </div>
                    <div class="px-2.5 pt-2 pb-2 flex-1 flex flex-col">
                        <router-link :to="productPath(product.id)" class="flex-1">
                            <h4 class="text-sm font-semibold text-brand leading-tight truncate">
                                {{ product.title }}
                            </h4>
                            <p class="text-[11px] text-gray-500 mt-1 truncate">
                                {{ product.description }}
                            </p>
                        </router-link>
                        <div class="flex items-end justify-between gap-2 mt-1">
                            <div class="min-w-0">
                                <span class="text-2xl font-extrabold text-brand leading-none">฿{{ product.displayPrice.toFixed(0) }}</span>
                            </div>
                            <button
                                v-if="!isQuoteMode"
                                @click="addToCart(product)"
                                class="bg-brand text-white w-8 h-8 rounded-full hover:bg-brand-dark transition-colors flex items-center justify-center shrink-0 shadow-sm"
                                aria-label="Add to cart"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import { useProductsStore } from '../stores/products'
import { useCartStore } from '../stores/cart'
import { CATEGORIES } from '../constants/categories'
import LoadingSpinner from '../components/LoadingSpinner.vue'

export default {
    name: 'CategoriesView',
    components: {
        LoadingSpinner,
    },
    data() {
        return {
            activeCategory: this.$route.query.cat || 'ทั้งหมด',
        }
    },
    watch: {
        '$route.query.cat'(newCat) {
            this.activeCategory = newCat || 'ทั้งหมด'
        },
    },
    mounted() {
        useProductsStore().getProducts()
    },
    computed: {
        categories() {
            return [...CATEGORIES, 'ทั้งหมด']
        },
        allActiveProducts() {
            return useProductsStore().products.filter((p) => p.isActive)
        },
        products() {
            if (this.activeCategory === 'ทั้งหมด') return this.allActiveProducts
            return this.allActiveProducts.filter((p) => this.productCategories(p).includes(this.activeCategory))
        },
        loading() {
            return useProductsStore().loading
        },
        error() {
            return useProductsStore().error
        },
        isQuoteMode() {
            return this.$route.query.quoteMode === 'true'
        },
    },
    methods: {
        productPath(id) {
            return this.isQuoteMode ? `/product/${id}?quoteMode=true` : `/product/${id}`
        },
        retry() {
            useProductsStore().getProducts()
        },
        productCategories(product) {
            if (Array.isArray(product.categories)) return product.categories
            return product.category ? [product.category] : []
        },
        addToCart(product) {
            if (!product.variants?.length) return
            if (product.variants.length > 1 || product.optionGroups?.length) {
                this.$router.push('/product/' + product.id)
                return
            }
            const variant = product.variants[0]
            useCartStore().addItem({
                key: `${product.id}_${variant.id}`,
                productId: product.id,
                variantId: variant.id,
                variantLabel: null,
                title: product.title,
                price: variant.price,
                imageUrl: product.imageUrl,
                stock: variant.stock ?? 0,
            })
        },
    },
}
</script>


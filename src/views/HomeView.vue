<template>
    <div class="bg-[#f8f9fa] pb-10">

        <!-- =====================================================================
             HERO BANNER (commented out — preserved for future use)
        ======================================================================= -->
        <!--
        <div class="px-4 mt-4">
            <div
                class="relative aspect-[16/9] rounded-2xl overflow-hidden group"
                @touchstart.passive="handleHeroTouchStart"
                @touchend="handleHeroTouchEnd"
            >
                <img
                    :src="currentHeroImage"
                    alt="Hero"
                    class="w-full h-full object-cover transition-all duration-500 ease-out"
                    :class="heroImageClasses"
                />
                <div class="absolute inset-0 bg-black/30 flex flex-col justify-center px-6">
                    <h2 class="text-white text-xl font-medium leading-tight">
                        เวชภัณฑ์ครบครัน สั่งง่าย<br />ส่งตรงถึงมือคุณ
                    </h2>
                </div>
                <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    <button
                        v-for="(image, index) in heroImages"
                        :key="image"
                        type="button"
                        class="w-2 h-2 rounded-full transition-colors"
                        :class="index === activeHeroIndex ? 'bg-white' : 'bg-white/50'"
                        :aria-label="`Show hero image ${index + 1}`"
                        @click="selectHeroImage(index)"
                    ></button>
                </div>
            </div>
        </div>
        -->

        <!-- Categories -->
        <div class="mt-5 px-4">
            <h3 class="text-base font-bold text-gray-800 mb-3">หมวดหมู่</h3>
            <div class="grid grid-cols-4 gap-2">
                <button
                    v-for="cat in categories"
                    :key="cat"
                    class="flex flex-col items-center gap-1.5 rounded-xl p-1.5 transition-all bg-white active:bg-brand/10"
                    @click="$router.push({ path: '/categories', query: { cat: cat } })"
                >
                    <div class="w-full aspect-square rounded-lg overflow-hidden bg-gray-50">
                        <img
                            :src="categoryImage(cat)"
                            :alt="cat"
                            class="w-full h-full object-contain p-1"
                        />
                    </div>
                    <span
                        class="text-[10px] font-medium leading-tight text-center line-clamp-2 w-full text-gray-600"
                    >
                        {{ cat }}
                    </span>
                </button>
            </div>
        </div>

        <!-- Product Grid -->
        <div class="mt-6 px-4">
            <h3 class="text-base font-bold text-gray-800 mb-3">สินค้าแนะนำ</h3>
            <div v-if="loading" class="flex justify-center items-center py-20">
                <LoadingSpinner />
            </div>
            <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl px-5 py-4 flex items-center justify-between">
                <span>{{ error }}</span>
                <button @click="retry" class="text-red-600 font-semibold underline text-sm ml-4">Retry</button>
            </div>
            <div v-else class="grid grid-cols-2 gap-3">
                <div
                    v-for="product in products"
                    :key="product.id"
                    class="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full"
                >
                    <div class="aspect-[1/1] bg-gray-50 relative">
                        <router-link :to="'/product/' + product.id" class="block w-full h-full">
                            <img
                                :src="product.imageUrl || '/images/mask.png'"
                                :alt="product.title"
                                class="w-full h-full object-cover"
                            />
                        </router-link>
                        <!-- Favourite placeholder -->
                        <button class="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                    </div>
                    <div class="px-2.5 pt-2 pb-2 flex-1 flex flex-col">
                        <router-link :to="'/product/' + product.id" class="flex-1">
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

        <!-- =====================================================================
             ช่องทางการสั่งซื้อ (commented out — preserved for future use)
        ======================================================================= -->
        <!--
        <div class="flex justify-center mt-10">
            <button class="bg-[#f1f3f5] text-gray-600 px-10 py-3 rounded-2xl font-medium text-sm">
                ดูทั้งหมด
            </button>
        </div>
        <div class="mt-12 bg-brand pt-8 pb-12 px-4 rounded-t-[40px]">
            <h3 class="text-white text-center text-lg font-medium mb-8">ช่องทางการสั่งซื้อ</h3>
            <div class="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                <a href="#" class="bg-white p-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/f/fe/Shopee.svg" alt="Shopee" class="h-6" />
                    <span class="font-bold text-[#ee4d2d] text-lg">Shopee</span>
                </a>
                <a href="#" class="bg-white p-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/4/4d/Lazada_%282019%29.svg" alt="Lazada" class="h-6" />
                    <span class="font-bold text-[#0f146d] text-lg">Lazada</span>
                </a>
                <a href="#" class="bg-white p-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg">
                    <img src="https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg" alt="TikTok" class="h-6" />
                    <span class="font-bold text-black text-lg">Shop</span>
                </a>
                <div class="bg-white/10 p-4 rounded-2xl border border-white/20 shadow-lg"></div>
            </div>
        </div>
        -->

    </div>
</template>

<script>
import { useProductsStore } from '../stores/products'
import { useCartStore } from '../stores/cart'
import { CATEGORIES, CATEGORY_IMAGES } from '../constants/categories'
import LoadingSpinner from '../components/LoadingSpinner.vue'

export default {
    name: 'HomeView',
    components: {
        LoadingSpinner,
    },
    data() {
        return {
            activeCategory: null,
            // ── Hero banner data (preserved for future use) ──────────────────
            // activeHeroIndex: 0,
            // heroTimer: null,
            // isAutoHeroAnimating: false,
            // isSwipeHeroAnimating: false,
            // heroSwipeDirection: null,
            // heroTouchStartX: 0,
            // heroTouchStartY: 0,
            // heroImages: [
            //     '/images/hero1.png',
            //     '/images/hero2.png',
            //     '/images/hero3.png',
            //     '/images/hero4.png',
            // ],
        }
    },
    mounted() {
        useProductsStore().getProducts()
        // this.startHeroTimer()
    },
    // beforeUnmount() {
    //     this.stopHeroTimer()
    // },
    computed: {
        categories() {
            return [...CATEGORIES, 'ทั้งหมด']
        },
        allActiveProducts() {
            return useProductsStore().products.filter((p) => p.isActive)
        },
        products() {
            return this.allActiveProducts
        },
        loading() {
            return useProductsStore().loading
        },
        error() {
            return useProductsStore().error
        },
    },
    methods: {
        categoryImage(cat) {
            return CATEGORY_IMAGES[cat] || null
        },
        retry() {
            useProductsStore().getProducts()
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
        // ── Hero banner methods (preserved for future use) ───────────────────
        // currentHeroImage() { return this.heroImages[this.activeHeroIndex] },
        // heroImageClasses() { ... },
        // startHeroTimer() { ... },
        // stopHeroTimer() { ... },
        // nextHeroImage() { ... },
        // selectHeroImage(index) { ... },
        // changeHeroBySwipe(direction) { ... },
        // handleHeroTouchStart(event) { ... },
        // handleHeroTouchEnd(event) { ... },
    },
}
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>

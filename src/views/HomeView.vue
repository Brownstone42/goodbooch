<template>
    <div class="bg-[#f8f9fa] min-h-screen pb-10">
        <!-- Top Header -->
        <header class="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
            <router-link to="/login" class="flex items-center justify-center w-9 h-9">
                <div v-if="isAuthenticated" class="w-9 h-9 rounded-full bg-brand text-white flex items-center justify-center text-sm font-bold">
                    {{ userInitial }}
                </div>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </router-link>
            <img src="/images/logo.png" alt="Goodbooch Supply" class="h-10 aspect-[3/1] object-contain" />
            <div class="flex items-center gap-3">
                <router-link to="/cart" class="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span v-if="cartItemCount > 0" class="absolute -top-1 -right-1 bg-brand text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                        {{ cartItemCount }}
                    </span>
                </router-link>
                <button @click="isMenuOpen = true" class="text-gray-600 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
        </header>

        <!-- Hamburger Menu Overlay -->
        <div v-if="isMenuOpen" class="fixed inset-0 z-[60] bg-black/50 transition-opacity" @click="isMenuOpen = false"></div>
        
        <!-- Hamburger Menu Drawer -->
        <div 
            class="fixed top-0 right-0 h-full w-72 bg-white z-[70] shadow-2xl transform transition-transform duration-300 flex flex-col"
            :class="isMenuOpen ? 'translate-x-0' : 'translate-x-full'"
        >
            <div class="p-5 flex items-center justify-between border-b border-gray-100">
                <h2 class="text-lg font-bold text-gray-900">Menu</h2>
                <button @click="isMenuOpen = false" class="text-gray-400 hover:text-gray-800 bg-gray-100 rounded-full p-1.5 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="py-2 flex-1 overflow-y-auto">
                <router-link to="/profile/address" class="flex items-center gap-3 px-6 py-4 text-gray-700 font-medium hover:bg-gray-50 border-b border-gray-50 transition-colors" @click="isMenuOpen = false">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Address Info
                </router-link>
                <router-link to="/purchase-history" class="flex items-center gap-3 px-6 py-4 text-gray-700 font-medium hover:bg-gray-50 border-b border-gray-50 transition-colors" @click="isMenuOpen = false">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                    Purchase History
                </router-link>
            </div>
        </div>

        <!-- Search Section -->
        <div class="px-6 mt-3">
            <div class="h-12 rounded-full bg-white shadow-md border border-gray-100 flex items-center px-4 gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m1.1-5.15a6.25 6.25 0 11-12.5 0 6.25 6.25 0 0112.5 0z" />
                </svg>
                <span class="text-sm text-gray-400 truncate">ค้นหา กู๊ดบู๊ชในไตรด์...</span>
            </div>
        </div>

        <!-- Hero Section -->
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
                <!-- Slider Dots -->
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

        <!-- Categories -->
        <div class="mt-6">
            <h3 class="px-4 text-lg font-bold text-gray-800 mb-3">หมวดหมู่</h3>
            <div class="flex overflow-x-auto gap-2 px-4 no-scrollbar">
                <button 
                    v-for="cat in categories" 
                    :key="cat"
                    :class="[
                        'whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors',
                        cat === activeCategory ? 'bg-brand text-white' : 'bg-[#f1f3f5] text-gray-600'
                    ]"
                    @click="activeCategory = cat"
                >
                    {{ cat }}
                </button>
            </div>
        </div>

        <!-- Product Grid -->
        <div v-if="loading" class="flex justify-center items-center py-20">
            <LoadingSpinner />
        </div>
        <div v-else-if="error" class="mx-4 mt-8 bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl px-5 py-4 flex items-center justify-between">
            <span>{{ error }}</span>
            <button @click="retry" class="text-red-600 font-semibold underline text-sm ml-4">Retry</button>
        </div>
        <div v-else class="grid grid-cols-2 gap-3 px-4 mt-8">
            <div 
                v-for="product in products" 
                :key="product.id"
                class="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 flex flex-col h-full"
            >
                <div class="aspect-[1/1] bg-gray-50">
                    <router-link :to="'/product/' + product.id" class="block w-full h-full">
                        <img :src="product.imageUrl || '/images/mask.png'" :alt="product.title" class="w-full h-full object-cover" />
                    </router-link>
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

        <!-- See All Button -->
        <div class="flex justify-center mt-10">
            <button class="bg-[#f1f3f5] text-gray-600 px-10 py-3 rounded-2xl font-medium text-sm">
                ดูทั้งหมด
            </button>
        </div>

        <!-- External Channels Section -->
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
    </div>
</template>

<script>
import { useProductsStore } from '../stores/products'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { CATEGORIES } from '../constants/categories'
import LoadingSpinner from '../components/LoadingSpinner.vue'

export default {
    name: 'HomeView',
    components: {
        LoadingSpinner,
    },
    data() {
        return {
            activeCategory: 'ทั้งหมด',
            isMenuOpen: false,
            activeHeroIndex: 0,
            heroTimer: null,
            isAutoHeroAnimating: false,
            isSwipeHeroAnimating: false,
            heroSwipeDirection: null,
            heroTouchStartX: 0,
            heroTouchStartY: 0,
            heroImages: [
                '/images/hero1.png',
                '/images/hero2.png',
                '/images/hero3.png',
                '/images/hero4.png',
            ],
        }
    },
    mounted() {
        useProductsStore().getProducts()
        this.startHeroTimer()
    },
    beforeUnmount() {
        this.stopHeroTimer()
    },
    computed: {
        isAuthenticated() { return useAuthStore().isAuthenticated },
        userInitial() { return (useAuthStore().user?.name || '?')[0].toUpperCase() },
        currentHeroImage() {
            return this.heroImages[this.activeHeroIndex]
        },
        heroImageClasses() {
            if (this.isAutoHeroAnimating) return 'opacity-0 scale-105'
            if (this.isSwipeHeroAnimating) {
                return this.heroSwipeDirection === 'next'
                    ? 'opacity-90 -translate-x-3'
                    : 'opacity-90 translate-x-3'
            }
            return 'opacity-100 scale-100 translate-x-0'
        },
        allActiveProducts() {
            return useProductsStore().products.filter((p) => p.isActive)
        },
        categories() {
            return ['ทั้งหมด', ...CATEGORIES]
        },
        products() {
            if (this.activeCategory === 'ทั้งหมด') return this.allActiveProducts
            return this.allActiveProducts.filter((p) => p.category === this.activeCategory)
        },
        loading() {
            return useProductsStore().loading
        },
        error() {
            return useProductsStore().error
        },
        cartItemCount() {
            return useCartStore().itemCount
        }
    },
    methods: {
        retry() {
            useProductsStore().getProducts()
        },
        startHeroTimer() {
            this.stopHeroTimer()
            this.heroTimer = window.setInterval(this.nextHeroImage, 5000)
        },
        stopHeroTimer() {
            if (!this.heroTimer) return
            window.clearInterval(this.heroTimer)
            this.heroTimer = null
        },
        nextHeroImage() {
            this.isAutoHeroAnimating = true
            window.setTimeout(() => {
                this.activeHeroIndex = (this.activeHeroIndex + 1) % this.heroImages.length
                this.isAutoHeroAnimating = false
            }, 250)
        },
        selectHeroImage(index) {
            this.isAutoHeroAnimating = false
            this.isSwipeHeroAnimating = false
            this.activeHeroIndex = index
            this.startHeroTimer()
        },
        changeHeroBySwipe(direction) {
            this.isAutoHeroAnimating = false
            this.isSwipeHeroAnimating = true
            this.heroSwipeDirection = direction
            window.setTimeout(() => {
                if (direction === 'next') {
                    this.activeHeroIndex = (this.activeHeroIndex + 1) % this.heroImages.length
                } else {
                    this.activeHeroIndex = (this.activeHeroIndex - 1 + this.heroImages.length) % this.heroImages.length
                }
                this.isSwipeHeroAnimating = false
                this.heroSwipeDirection = null
            }, 180)
            this.startHeroTimer()
        },
        handleHeroTouchStart(event) {
            const touch = event.changedTouches[0]
            this.heroTouchStartX = touch.clientX
            this.heroTouchStartY = touch.clientY
        },
        handleHeroTouchEnd(event) {
            const touch = event.changedTouches[0]
            const deltaX = touch.clientX - this.heroTouchStartX
            const deltaY = touch.clientY - this.heroTouchStartY
            if (Math.abs(deltaX) < 40 || Math.abs(deltaX) < Math.abs(deltaY)) return
            this.changeHeroBySwipe(deltaX < 0 ? 'next' : 'prev')
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
        }
    }
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>

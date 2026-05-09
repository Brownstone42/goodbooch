<template>
    <div class="bg-[#f8f9fa] min-h-screen pb-10">
        <!-- Top Header -->
        <header class="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
            <router-link to="/login" class="flex items-center justify-center w-9 h-9">
                <div v-if="isAuthenticated" class="w-9 h-9 rounded-full bg-[#005c3d] text-white flex items-center justify-center text-sm font-bold">
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
                    <span v-if="cartItemCount > 0" class="absolute -top-1 -right-1 bg-[#005c3d] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
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

        <!-- Hero Section -->
        <div class="px-4 mt-4">
            <div class="relative aspect-[16/9] rounded-2xl overflow-hidden group">
                <img src="/images/hero.png" alt="Hero" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-black/30 flex flex-col justify-center px-6">
                    <h2 class="text-white text-xl font-medium leading-tight">
                        เวชภัณฑ์ครบครัน สั่งง่าย<br />ส่งตรงถึงมือคุณ
                    </h2>
                </div>
                <!-- Slider Dots -->
                <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-white/50"></div>
                    <div class="w-2 h-2 rounded-full bg-white"></div>
                    <div class="w-2 h-2 rounded-full bg-white/50"></div>
                    <div class="w-2 h-2 rounded-full bg-white/50"></div>
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
                        cat === activeCategory ? 'bg-[#005c3d] text-white' : 'bg-[#f1f3f5] text-gray-600'
                    ]"
                    @click="activeCategory = cat"
                >
                    {{ cat }}
                </button>
            </div>
        </div>

        <!-- Product Grid -->
        <div v-if="loading" class="flex justify-center items-center py-20">
            <div class="w-8 h-8 border-4 border-[#005c3d] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div v-else-if="error" class="mx-4 mt-8 bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl px-5 py-4 flex items-center justify-between">
            <span>{{ error }}</span>
            <button @click="retry" class="text-red-600 font-semibold underline text-sm ml-4">Retry</button>
        </div>
        <div v-else class="grid grid-cols-2 gap-x-3 gap-y-6 px-4 mt-8">
            <div 
                v-for="product in products" 
                :key="product.id"
                class="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full"
            >
                <div class="relative aspect-[4/3]">
                    <router-link :to="'/product/' + product.id">
                        <img :src="product.imageUrl || '/images/mask.png'" :alt="product.title" class="w-full h-full object-cover" />
                    </router-link>
                    <button class="absolute top-3 right-3 text-white drop-shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                </div>
                <div class="p-4 flex-1 flex flex-col">
                    <router-link :to="'/product/' + product.id" class="flex-1">
                        <h4 class="text-sm font-medium text-gray-800 line-clamp-2 leading-tight min-h-[2.5rem]">
                            {{ product.title }}
                        </h4>
                        <p class="text-[11px] text-gray-400 mt-1 uppercase">
                            {{ product.description }}
                        </p>
                    </router-link>
                    <div class="flex items-end justify-between mt-3">
                        <div>
                            <span class="text-lg font-bold text-gray-900">{{ product.displayPrice.toFixed(2) }}</span>
                            <span class="text-sm text-gray-500 ml-1">บาท</span>
                        </div>
                        <button 
                            @click="addToCart(product)"
                            class="bg-[#005c3d] text-white p-2 rounded-full hover:bg-[#004d33] transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <div class="mt-12 bg-[#005c3d] pt-8 pb-12 px-4 rounded-t-[40px]">
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

export default {
    name: 'HomeView',
    data() {
        return {
            activeCategory: 'ทั้งหมด',
            isMenuOpen: false,
        }
    },
    mounted() {
        useProductsStore().getProducts()
    },
    computed: {
        isAuthenticated() { return useAuthStore().isAuthenticated },
        userInitial() { return (useAuthStore().user?.name || '?')[0].toUpperCase() },
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

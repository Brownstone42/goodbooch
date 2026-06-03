<template>
    <div class="bg-[#f8f9fa] pb-24 min-h-screen">

        <!-- Header -->
        <div class="px-4 pt-5 pb-4 flex items-center gap-3">
            <button
                @click="$router.back()"
                class="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center shrink-0"
                aria-label="Back"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <h1 class="text-xl font-bold text-gray-900">สินค้าโปรด</h1>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex justify-center items-center py-20">
            <LoadingSpinner />
        </div>

        <!-- Empty -->
        <div v-else-if="favoriteProducts.length === 0" class="flex flex-col items-center justify-center py-24 px-4 text-center">
            <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </div>
            <p class="text-sm font-medium text-gray-500">ยังไม่มีสินค้าโปรด</p>
            <p class="text-xs text-gray-400 mt-1">กดไอคอนหัวใจบนสินค้าเพื่อบันทึก</p>
        </div>

        <!-- Grid -->
        <div v-else class="px-4">
            <div class="grid grid-cols-2 gap-3">
                <div
                    v-for="product in favoriteProducts"
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
                        <button
                            @click.prevent.stop="toggleFavorite(product.id)"
                            class="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center shadow-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                    </div>
                    <div class="px-2.5 pt-2 pb-2 flex-1 flex flex-col">
                        <router-link :to="'/product/' + product.id" class="flex-1">
                            <h4 class="text-sm font-semibold text-brand leading-tight truncate">{{ product.title }}</h4>
                            <p class="text-[11px] text-gray-500 mt-1 truncate">{{ product.description }}</p>
                        </router-link>
                        <div class="flex items-end justify-between gap-2 mt-1">
                            <span class="text-2xl font-extrabold text-brand leading-none">฿{{ product.displayPrice.toFixed(0) }}</span>
                            <button
                                @click="addToCart(product)"
                                class="bg-brand text-white w-8 h-8 rounded-full hover:bg-brand-dark transition-colors flex items-center justify-center shrink-0 shadow-sm"
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
import { useFavoritesStore } from '../stores/favorites'
import { useAuthStore } from '../stores/auth'
import LoadingSpinner from '../components/LoadingSpinner.vue'

export default {
    name: 'FavoritesView',
    components: { LoadingSpinner },
    computed: {
        loading() {
            return useFavoritesStore().loading || useProductsStore().loading
        },
        favoriteProducts() {
            const ids = useFavoritesStore().productIds
            return useProductsStore().products.filter((p) => p.isActive && ids.includes(p.id))
        },
    },
    mounted() {
        const auth = useAuthStore()
        if (!auth.isAuthenticated) {
            this.$router.replace('/profile')
            return
        }
        useFavoritesStore().fetchFavorites(auth.user.id)
        if (useProductsStore().products.length === 0) useProductsStore().getProducts()
    },
    methods: {
        toggleFavorite(productId) {
            const auth = useAuthStore()
            useFavoritesStore().toggleFavorite(auth.user.id, productId)
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

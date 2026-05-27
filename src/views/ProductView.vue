<template>
    <div class="relative">

        <!-- Back button — overlaid top-left -->
        <button
            @click="$router.back()"
            class="absolute top-3 left-3 z-10 w-9 h-9 rounded-full bg-gray-500/60 flex items-center justify-center"
            aria-label="Back"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
        </button>

        <!-- Share button — overlaid top-right -->
        <button
            class="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-gray-500/60 flex items-center justify-center"
            aria-label="Share"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
        </button>

        <div v-if="loading" class="flex justify-center items-center py-32">
            <div class="w-8 h-8 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
        </div>
        <div v-else-if="error" class="p-8 text-center text-red-500 text-sm">{{ error }}</div>
        <div v-else-if="product">
            <!-- Image Carousel -->
            <div class="relative w-full aspect-square overflow-hidden bg-gray-100">
                <img
                    :src="carouselImages[currentImageIndex]"
                    :alt="product.title"
                    class="w-full h-full object-cover"
                />

                <!-- Left tap zone -->
                <div
                    class="absolute left-0 top-0 w-1/2 h-full"
                    @click="prevImage"
                />

                <!-- Right tap zone -->
                <div
                    class="absolute right-0 top-0 w-1/2 h-full"
                    @click="nextImage"
                />

                <!-- Bottom scrim — makes dots readable on any image background -->
                <div v-if="carouselImages.length > 1" class="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

                <!-- Navigation dots -->
                <div v-if="carouselImages.length > 1" class="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
                    <button
                        v-for="(img, i) in carouselImages"
                        :key="i"
                        @click.stop="goToImage(i)"
                        class="w-2 h-2 rounded-full transition-all pointer-events-auto"
                        :class="i === currentImageIndex ? 'bg-white scale-110' : 'bg-white/50'"
                    />
                </div>
            </div>
            <div class="p-4">
                <h1 class="text-2xl font-bold">{{ product.title }}</h1>
                <p class="text-xl text-gray-600 mt-1">฿{{ displayPrice.toFixed(2) }}</p>
                <div v-if="selectedVariant" class="mt-1 text-sm font-medium">
                    <span v-if="displayStock > 0" class="text-gray-500">Stock: {{ displayStock }}</span>
                    <span v-else class="text-red-500">Out of Stock</span>
                </div>
                <p class="text-gray-500 mt-3 leading-relaxed">{{ product.description }}</p>

                <div v-for="group in product.optionGroups" :key="group.name" class="mt-4">
                    <p class="text-sm font-semibold text-gray-700 mb-2">{{ group.name }}</p>
                    <div class="flex flex-wrap gap-2">
                        <button
                            v-for="option in group.options"
                            :key="option"
                            @click="selectedOptions[group.name] = option"
                            :class="[
                                'px-4 py-2 rounded-xl border text-sm font-medium transition-all',
                                selectedOptions[group.name] === option
                                    ? 'bg-brand text-white border-brand'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-brand hover:text-brand'
                            ]"
                        >
                            {{ option }}
                        </button>
                    </div>
                </div>

                <!-- Quote mode: single select button -->
                <div v-if="isQuoteMode" class="mt-6">
                    <button
                        @click="selectForQuote"
                        class="w-full bg-brand text-white py-3.5 rounded-xl text-base font-semibold flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        เลือกสินค้านี้เป็นสินค้าอ้างอิง
                    </button>
                    <button @click="$router.back()" class="w-full mt-2 text-gray-400 text-sm py-2">ยกเลิก</button>
                </div>

                <!-- Normal mode: add to cart + buy now -->
                <div v-else class="mt-6 flex gap-3">
                    <button
                        @click="addToCart"
                        :disabled="!selectedVariant || displayStock === 0"
                        class="flex-1 border-2 border-brand text-brand bg-white py-3.5 rounded-xl text-base font-medium transition-colors hover:bg-brand hover:text-white disabled:opacity-40 disabled:pointer-events-none"
                    >
                        Add to Cart
                    </button>
                    <button
                        @click="buyNow"
                        :disabled="!selectedVariant || displayStock === 0"
                        class="flex-1 bg-brand text-white py-3.5 rounded-xl text-base font-medium transition-colors hover:bg-brand-dark disabled:opacity-40 disabled:pointer-events-none"
                    >
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
        <div v-else class="p-8 text-center text-gray-400">Product not found.</div>

    </div>
</template>

<script>
import { useProductsStore } from '../stores/products'
import { useCartStore } from '../stores/cart'
import { useQuotationStore } from '../stores/quotation'

export default {
    data() {
        return {
            selectedOptions: {},
            currentImageIndex: 0,
        }
    },
    computed: {
        product() {
            return useProductsStore().getById(this.$route.params.id)
        },
        loading() {
            return useProductsStore().loading
        },
        error() {
            return useProductsStore().error
        },
        selectedVariant() {
            if (!this.product?.variants) return null
            if (!this.product.optionGroups?.length) return this.product.variants[0] ?? null
            return (
                this.product.variants.find((v) =>
                    v.optionValues.every(
                        (val, i) => this.selectedOptions[this.product.optionGroups[i]?.name] === val
                    )
                ) ?? null
            )
        },
        displayPrice() {
            return this.selectedVariant?.price ?? this.product?.displayPrice ?? 0
        },
        displayImage() {
            return this.selectedVariant?.imageUrl || this.product?.coverImageUrl || this.product?.imageUrl || '/images/mask.png'
        },
        carouselImages() {
            const cover = this.product?.coverImageUrl || this.product?.imageUrl || '/images/mask.png'
            const images = [cover]
            for (const url of this.product?.detailImageUrls ?? []) {
                if (url && !images.includes(url)) images.push(url)
            }
            for (const v of this.product?.variants ?? []) {
                if (v.imageUrl && !images.includes(v.imageUrl)) images.push(v.imageUrl)
            }
            return images
        },
        displayStock() {
            return this.selectedVariant?.stock ?? 0
        },
        isQuoteMode() {
            return this.$route.query.quoteMode === 'true'
        },
    },
    watch: {
        // When a variant is selected, jump the carousel to that variant's image
        selectedVariant(newVariant) {
            if (!newVariant?.imageUrl) return
            const idx = this.carouselImages.indexOf(newVariant.imageUrl)
            if (idx !== -1) this.currentImageIndex = idx
        },
        // Reset carousel when navigating to a different product
        '$route.params.id'() {
            this.currentImageIndex = 0
        },
    },
    mounted() {
        if (useProductsStore().products.length === 0) {
            useProductsStore().getProducts()
        }
    },
    methods: {
        prevImage() {
            this.currentImageIndex = (this.currentImageIndex - 1 + this.carouselImages.length) % this.carouselImages.length
        },
        nextImage() {
            this.currentImageIndex = (this.currentImageIndex + 1) % this.carouselImages.length
        },
        goToImage(i) {
            this.currentImageIndex = i
        },
        buildCartItem() {
            const product = this.product
            const variant = this.selectedVariant
            const label = product.optionGroups?.length
                ? product.optionGroups.map((g) => this.selectedOptions[g.name]).join(' / ')
                : null
            return {
                key: `${product.id}_${variant.id}`,
                productId: product.id,
                variantId: variant.id,
                variantLabel: label,
                title: product.title,
                price: variant.price,
                imageUrl: this.displayImage,
                stock: variant.stock ?? 0,
            }
        },
        addToCart() {
            if (!this.selectedVariant) return
            useCartStore().addItem(this.buildCartItem())
            this.$router.push('/cart')
        },
        buyNow() {
            if (!this.selectedVariant) return
            useCartStore().addItem(this.buildCartItem())
            this.$router.push('/checkout')
        },
        selectForQuote() {
            useQuotationStore().setProductRef({
                id:             this.product.id,
                title:          this.product.title,
                imageUrl:       this.product.imageUrl || this.product.coverImageUrl || null,
                coverImageUrl:  this.product.coverImageUrl || null,
            })
            this.$router.push('/quote')
        },
    },
}
</script>

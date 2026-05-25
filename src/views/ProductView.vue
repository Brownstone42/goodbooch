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
            <img
                :src="displayImage"
                :alt="product.title"
                class="w-full aspect-square object-cover"
            />
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
                                    ? 'bg-black text-white border-black'
                                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                            ]"
                        >
                            {{ option }}
                        </button>
                    </div>
                </div>

                <button
                    @click="addToCart"
                    :disabled="!selectedVariant || displayStock === 0"
                    class="mt-6 w-full bg-black text-white py-3.5 rounded-xl text-base font-medium disabled:opacity-50"
                >
                    Add to Cart
                </button>
            </div>
        </div>
        <div v-else class="p-8 text-center text-gray-400">Product not found.</div>

    </div>
</template>

<script>
import { useProductsStore } from '../stores/products'
import { useCartStore } from '../stores/cart'

export default {
    data() {
        return {
            selectedOptions: {},
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
        displayStock() {
            return this.selectedVariant?.stock ?? 0
        },
    },
    mounted() {
        if (useProductsStore().products.length === 0) {
            useProductsStore().getProducts()
        }
    },
    methods: {
        addToCart() {
            if (!this.selectedVariant) return
            const product = this.product
            const variant = this.selectedVariant
            const label = product.optionGroups?.length
                ? product.optionGroups.map((g) => this.selectedOptions[g.name]).join(' / ')
                : null
            useCartStore().addItem({
                key: `${product.id}_${variant.id}`,
                productId: product.id,
                variantId: variant.id,
                variantLabel: label,
                title: product.title,
                price: variant.price,
                imageUrl: this.displayImage,
                stock: variant.stock ?? 0,
            })
            this.$router.push('/cart')
        },
    },
}
</script>

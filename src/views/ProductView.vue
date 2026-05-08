<template>
    <div>
        <div class="p-4">
            <button @click="$router.back()" class="text-gray-500 text-sm">← Back</button>
        </div>
        <div v-if="loading" class="flex justify-center items-center py-32">
            <div class="w-8 h-8 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
        </div>
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
    watch: {
        product(val) {
            if (val) this.initOptions()
        },
    },
    mounted() {
        if (useProductsStore().products.length === 0) {
            useProductsStore().getProducts()
        } else {
            this.initOptions()
        }
    },
    methods: {
        initOptions() {
            if (!this.product?.optionGroups) return
            const opts = {}
            for (const group of this.product.optionGroups) {
                opts[group.name] = group.options[0] ?? ''
            }
            this.selectedOptions = opts
        },
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

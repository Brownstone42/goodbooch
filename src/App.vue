<template>
    <div :class="['min-h-screen bg-gray-50', !isAdmin ? 'pb-16' : '']">
        <router-view />
        <nav v-if="!isAdmin" class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex sm:hidden">
            <router-link
                to="/"
                class="flex-1 flex items-center justify-center py-3 text-sm text-gray-500"
                active-class="text-black font-semibold"
            >
                Shop
            </router-link>
            <router-link
                to="/cart"
                class="flex-1 flex items-center justify-center py-3 text-sm text-gray-500"
                active-class="text-black font-semibold"
            >
                Cart ({{ itemCount }})
            </router-link>
        </nav>
    </div>
</template>

<script>
import { useCartStore } from './stores/cart'

export default {
    computed: {
        itemCount() {
            return useCartStore().itemCount
        },
        isAdmin() {
            return this.$route.path.startsWith('/admin')
        },
    },
}
</script>

<style scoped></style>

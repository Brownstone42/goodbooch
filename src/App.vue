<template>
    <div class="flex flex-col h-screen bg-gray-50">
        <AppHeader v-if="showHeader" />
        <div class="flex-1 overflow-y-auto">
            <router-view />
        </div>
        <AppBottomNav v-if="showNav" />
    </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue'
import AppBottomNav from './components/AppBottomNav.vue'

export default {
    components: {
        AppHeader,
        AppBottomNav,
    },
    computed: {
        isAdmin() {
            return this.$route.path.startsWith('/admin')
        },
        showNav() {
            return !this.isAdmin
        },
        showHeader() {
            return !this.isAdmin && this.$route.path !== '/login'
        },
    },
}
</script>

<style scoped></style>

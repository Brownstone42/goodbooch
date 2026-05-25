<template>
    <div class="flex flex-col h-screen bg-gray-50">
        <div v-if="showHeader" class="shrink-0">
            <AppHeader />
        </div>
        <div class="flex-1 overflow-y-auto min-h-0">
            <router-view />
        </div>
        <div v-if="showNav" class="shrink-0">
            <AppBottomNav />
        </div>
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

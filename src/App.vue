<template>
    <div :class="['min-h-screen bg-gray-50', showNav ? 'pb-16' : '']">
        <AppHeader v-if="showHeader" />
        <router-view />
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

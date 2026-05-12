<template>
    <div class="p-4 max-w-lg mx-auto">
        <div class="mb-4">
            <button @click="$router.back()" class="text-gray-500 text-sm">← Back</button>
        </div>

        <!-- Logged in state -->
        <div v-if="isAuthenticated">
            <h1 class="text-2xl font-bold mb-6">My Profile</h1>

            <div class="bg-gray-50 rounded-2xl p-5 mb-6 flex items-center gap-4">
                <div class="w-14 h-14 rounded-full bg-brand text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
                    {{ userInitial }}
                </div>
                <div>
                    <p class="font-bold text-gray-900 text-lg">{{ user.name }}</p>
                    <p class="text-sm text-gray-500 mt-0.5">{{ user.phone }}</p>
                </div>
            </div>

            <button
                @click="logout"
                class="w-full border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all"
            >
                Sign Out
            </button>
        </div>

        <!-- Login form -->
        <div v-else>
            <h1 class="text-2xl font-bold mb-2">Sign In</h1>
            <p class="text-gray-500 text-sm mb-6">Enter your name and phone number to continue.</p>

            <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{{ error }}</div>

            <form @submit.prevent="submit" class="space-y-4">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">Name</label>
                    <input
                        v-model="form.name"
                        type="text"
                        placeholder="Your full name"
                        autocomplete="name"
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                    />
                </div>

                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
                    <input
                        v-model="form.phone"
                        type="tel"
                        placeholder="Phone number"
                        autocomplete="tel"
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                    />
                </div>

                <button
                    type="submit"
                    :disabled="loading"
                    class="w-full bg-brand text-white py-3.5 rounded-xl text-base font-medium disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                    {{ loading ? 'Signing in...' : 'Continue' }}
                </button>
            </form>
        </div>
    </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'

export default {
    name: 'LoginView',
    data() {
        return {
            loading: false,
            error: '',
            form: { name: '', phone: '' },
        }
    },
    computed: {
        isAuthenticated() { return useAuthStore().isAuthenticated },
        user() { return useAuthStore().user },
        userInitial() { return (useAuthStore().user?.name || '?')[0].toUpperCase() },
    },
    methods: {
        async submit() {
            this.error = ''
            this.loading = true
            try {
                useAuthStore().login(this.form)
                const redirect = this.$route.query.redirect || '/'
                this.$router.push(redirect)
            } catch (e) {
                this.error = e.message
            }
            this.loading = false
        },
        logout() {
            useAuthStore().logout()
        },
    },
}
</script>

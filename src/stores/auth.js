import { defineStore } from 'pinia'

const STORAGE_KEY = 'goodbooch_auth'

function loadUser() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null }
    catch { return null }
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: loadUser(),
    }),
    getters: {
        isAuthenticated: (state) => !!state.user,
    },
    actions: {
        login({ name, phone }) {
            if (!name.trim() || !phone.trim()) {
                throw new Error('Please enter your name and phone number.')
            }
            const user = { id: `customer-${Date.now()}`, name: name.trim(), phone: phone.trim(), provider: 'mock' }
            this.user = user
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
        },

        // LINE LIFF: replace body with real LIFF SDK calls when integrating
        // Example:
        //   await liff.init({ liffId: '...' })
        //   const profile = await liff.getProfile()
        //   authStore.loginWithLiff(profile)
        loginWithLiff(liffProfile) {
            const user = {
                id: liffProfile.userId,
                name: liffProfile.displayName,
                phone: '',
                provider: 'liff',
            }
            this.user = user
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
        },

        logout() {
            this.user = null
            localStorage.removeItem(STORAGE_KEY)
        },
    },
})

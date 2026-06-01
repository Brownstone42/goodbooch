import { defineStore } from 'pinia'
import { doc, setDoc } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../firebase'

const STORAGE_KEY = 'goodbooch_auth'

function loadUser() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null }
    catch { return null }
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: loadUser(),
        loading: false,
        error: null,
    }),
    getters: {
        isAuthenticated: (state) => !!state.user,
    },
    actions: {
        login({ name, phone }) {
            if (!name.trim() || !phone.trim()) {
                throw new Error('Please enter your name and phone number.')
            }
            const user = { id: `customer-${Date.now()}`, name: name.trim(), phone: phone.trim(), email: '', photoURL: '', provider: 'mock' }
            this.user = user
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
        },

        // LINE LIFF: replace body with real LIFF SDK calls when integrating
        loginWithLiff(liffProfile) {
            const user = {
                id: liffProfile.userId,
                name: liffProfile.displayName,
                phone: '',
                email: '',
                photoURL: liffProfile.pictureUrl || '',
                provider: 'liff',
            }
            this.user = user
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
        },

        async updateProfile({ name, email, phone }) {
            this.loading = true
            this.error = null
            try {
                await setDoc(doc(db, 'users', this.user.id), { name, email, phone }, { merge: true })
                const updated = { ...this.user, name, email, phone }
                this.user = updated
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
            } catch (e) {
                this.error = 'ไม่สามารถบันทึกข้อมูลได้'
                throw e
            } finally {
                this.loading = false
            }
        },

        async uploadAvatar(file) {
            this.loading = true
            this.error = null
            try {
                const avatarRef = storageRef(storage, `users/${this.user.id}/avatar`)
                await uploadBytes(avatarRef, file)
                const photoURL = await getDownloadURL(avatarRef)
                await setDoc(doc(db, 'users', this.user.id), { photoURL }, { merge: true })
                const updated = { ...this.user, photoURL }
                this.user = updated
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
                return photoURL
            } catch (e) {
                this.error = 'ไม่สามารถอัปโหลดรูปภาพได้'
                throw e
            } finally {
                this.loading = false
            }
        },

        logout() {
            this.user = null
            localStorage.removeItem(STORAGE_KEY)
        },
    },
})

<template>
    <div class="bg-[#f8f9fa] min-h-screen pb-24">

        <!-- Header -->
        <div class="px-4 pt-5 pb-4 flex items-center gap-3">
            <button
                @click="$router.back()"
                class="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center shrink-0"
                aria-label="Back"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <h1 class="text-xl font-bold text-gray-900">ข้อมูลส่วนตัว</h1>
        </div>

        <!-- Avatar + identity -->
        <div class="flex flex-col items-center pt-6 pb-8">
            <div class="relative">
                <div class="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                    <img v-if="photoURL" :src="photoURL" class="w-full h-full object-cover" alt="avatar" />
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                </div>
                <button
                    @click="$refs.fileInput.click()"
                    class="absolute bottom-0 right-0 w-8 h-8 bg-brand rounded-full flex items-center justify-center shadow"
                    :disabled="uploading"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
                <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onAvatarChange" />
            </div>
            <p class="mt-3 text-base font-semibold text-gray-800">{{ user.name }}</p>
            <p class="text-sm text-gray-400 mt-0.5">GB ID: {{ gbId }}</p>
        </div>

        <!-- Form -->
        <div class="px-4 flex flex-col gap-4">
            <div v-if="uploadError || saveError" class="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                {{ uploadError || saveError }}
            </div>

            <div>
                <label class="block text-sm font-bold text-gray-800 mb-2">ชื่อ-นามสกุล</label>
                <input
                    v-model="form.name"
                    type="text"
                    placeholder="ชื่อ-นามสกุล"
                    class="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-brand transition-colors"
                />
            </div>

            <div>
                <label class="block text-sm font-bold text-gray-800 mb-2">อีเมล</label>
                <input
                    v-model="form.email"
                    type="email"
                    placeholder="example@email.com"
                    class="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-brand transition-colors"
                />
            </div>

            <div>
                <label class="block text-sm font-bold text-gray-800 mb-2">เบอร์โทรศัพท์</label>
                <input
                    v-model="form.phone"
                    type="tel"
                    placeholder="0XX-XXX-XXXX"
                    class="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-brand transition-colors"
                />
            </div>
        </div>

        <!-- Save button -->
        <div class="px-4 pt-8">
            <button
                @click="save"
                :disabled="saving"
                class="w-full bg-brand text-white py-4 rounded-2xl text-base font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {{ saving ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง' }}
            </button>
        </div>

    </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'

export default {
    name: 'ProfileUserView',
    data() {
        return {
            form: { name: '', email: '', phone: '' },
            saving: false,
            uploading: false,
            saveError: '',
            uploadError: '',
        }
    },
    computed: {
        user() { return useAuthStore().user },
        photoURL() { return this.user?.photoURL || '' },
        gbId() {
            const digits = (this.user?.id || '').replace(/\D/g, '')
            return digits.slice(-7) || '—'
        },
    },
    created() {
        if (this.user) {
            this.form.name = this.user.name || ''
            this.form.email = this.user.email || ''
            this.form.phone = this.user.phone || ''
        }
    },
    methods: {
        async onAvatarChange(e) {
            const file = e.target.files[0]
            if (!file) return
            this.uploadError = ''
            this.uploading = true
            try {
                await useAuthStore().uploadAvatar(file)
            } catch {
                this.uploadError = 'ไม่สามารถอัปโหลดรูปภาพได้'
            } finally {
                this.uploading = false
                e.target.value = ''
            }
        },
        async save() {
            this.saveError = ''
            this.saving = true
            try {
                await useAuthStore().updateProfile({
                    name: this.form.name.trim(),
                    email: this.form.email.trim(),
                    phone: this.form.phone.trim(),
                })
                this.$router.back()
            } catch {
                this.saveError = 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่'
            } finally {
                this.saving = false
            }
        },
    },
}
</script>

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
            <h1 class="text-xl font-bold text-gray-900">วิธีการชำระเงิน</h1>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex justify-center items-center py-20">
            <div class="w-8 h-8 border-4 border-gray-200 border-t-brand rounded-full animate-spin"></div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="mx-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl px-5 py-4 flex items-center justify-between">
            <span>{{ error }}</span>
            <button @click="reload" class="text-red-600 font-semibold underline text-sm ml-4">Retry</button>
        </div>

        <template v-else>
            <!-- Section label -->
            <p class="px-4 text-brand font-bold text-sm mb-3">บัตรที่บันทึกไว้</p>

            <!-- Card list -->
            <div class="px-4 flex flex-col gap-3">
                <div
                    v-for="card in cards"
                    :key="card.id"
                    class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                    <!-- Card body -->
                    <div class="px-4 pt-4 pb-3">
                        <div class="flex items-start gap-3">
                            <div class="shrink-0 mt-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" :class="card.isPrimary ? 'text-brand' : 'text-gray-300'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="font-semibold text-sm text-gray-800">**** **** **** {{ card.last4 }}</p>
                                <p class="text-xs text-gray-500 mt-0.5">{{ card.brand }}</p>
                                <div class="flex items-center gap-2 mt-0.5">
                                    <p class="text-xs text-gray-400">Expires {{ card.expiryMonth }}/{{ String(card.expiryYear).slice(-2) }}</p>
                                    <span v-if="isExpired(card.expiryMonth, card.expiryYear)" class="text-xs font-semibold text-red-500">หมดอายุ</span>
                                </div>
                            </div>
                            <span
                                v-if="card.isPrimary"
                                class="shrink-0 text-[11px] font-semibold text-white bg-brand px-2.5 py-0.5 rounded-full"
                            >ช่องทางหลัก</span>
                        </div>
                    </div>

                    <!-- Card footer -->
                    <div class="border-t border-gray-100 px-4 py-2.5 flex items-center justify-between">
                        <button
                            v-if="!card.isPrimary"
                            @click="handleSetPrimary(card.id)"
                            class="text-brand text-sm font-medium"
                        >ตั้งเป็นช่องทางหลัก</button>
                        <div v-else />
                        <button
                            @click="handleDelete(card.id)"
                            class="flex items-center gap-1 text-gray-400 text-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                            ลบ
                        </button>
                    </div>
                </div>

                <!-- Empty state -->
                <div v-if="cards.length === 0" class="flex flex-col items-center justify-center py-16 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-14 w-14 mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <p class="text-sm font-medium">ยังไม่มีบัตรที่บันทึกไว้</p>
                </div>
            </div>

            <!-- Add button -->
            <div class="px-4 mt-5">
                <button
                    @click="openSheet"
                    class="w-full border-2 border-dashed border-gray-300 text-gray-400 py-4 rounded-2xl text-sm font-medium"
                >
                    + เพิ่มบัตรเครดิต
                </button>
            </div>
        </template>

        <!-- Bottom sheet overlay -->
        <div v-if="showSheet" class="fixed inset-0 bg-black/40 z-40" @click="closeSheet" />

        <!-- Bottom sheet -->
        <div v-if="showSheet" class="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 px-5 pt-5 pb-8">
            <div class="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h2 class="text-base font-bold text-gray-900 mb-5">เพิ่มบัตรเครดิต</h2>

            <div v-if="sheetError" class="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{{ sheetError }}</div>

            <div class="flex flex-col gap-4">
                <div>
                    <label class="block text-sm font-bold text-gray-800 mb-1.5">ชื่อบนบัตร</label>
                    <input
                        v-model="form.name"
                        type="text"
                        placeholder="FIRSTNAME LASTNAME"
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-brand transition-colors uppercase"
                    />
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-800 mb-1.5">หมายเลขบัตร</label>
                    <input
                        v-model="form.cardNumberDisplay"
                        type="text"
                        inputmode="numeric"
                        maxlength="19"
                        placeholder="0000 0000 0000 0000"
                        @input="onCardNumberInput"
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-brand transition-colors tracking-widest font-mono"
                    />
                </div>

                <div class="flex gap-3">
                    <div class="flex-1">
                        <label class="block text-sm font-bold text-gray-800 mb-1.5">วันหมดอายุ</label>
                        <input
                            v-model="form.expiry"
                            type="text"
                            inputmode="numeric"
                            maxlength="5"
                            placeholder="MM/YY"
                            @input="onExpiryInput"
                            class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-brand transition-colors"
                        />
                    </div>
                    <div class="w-28">
                        <label class="block text-sm font-bold text-gray-800 mb-1.5">CVV</label>
                        <input
                            v-model="form.cvv"
                            type="text"
                            inputmode="numeric"
                            maxlength="4"
                            placeholder="000"
                            class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-brand transition-colors tracking-widest font-mono"
                        />
                    </div>
                </div>
            </div>

            <div class="flex gap-3 mt-6">
                <button
                    @click="closeSheet"
                    class="flex-1 border border-gray-200 text-gray-600 py-3.5 rounded-xl text-sm font-semibold"
                >ยกเลิก</button>
                <button
                    @click="handleAdd"
                    :disabled="adding"
                    class="flex-1 bg-brand text-white py-3.5 rounded-xl text-sm font-semibold disabled:opacity-60"
                >{{ adding ? 'กำลังบันทึก...' : 'บันทึก' }}</button>
            </div>
        </div>

    </div>
</template>

<script>
import { usePaymentStore } from '../stores/payment'
import { useAuthStore } from '../stores/auth'

export default {
    name: 'ProfilePaymentView',
    data() {
        return {
            showSheet: false,
            adding: false,
            sheetError: '',
            form: { cardNumberDisplay: '', name: '', expiry: '', cvv: '' },
        }
    },
    computed: {
        cards()   { return usePaymentStore().cards },
        loading() { return usePaymentStore().loading },
        error()   { return usePaymentStore().error },
        userId()  { return useAuthStore().user?.id },
    },
    mounted() {
        if (!this.userId) {
            this.$router.replace('/profile')
            return
        }
        usePaymentStore().fetchCards(this.userId)
    },
    methods: {
        isExpired(month, year) {
            if (!month || !year) return false
            const exp = new Date(year, month - 1, 1)
            const today = new Date()
            today.setDate(1)
            today.setHours(0, 0, 0, 0)
            return exp < today
        },
        reload() {
            usePaymentStore().fetchCards(this.userId)
        },
        openSheet() {
            this.form = { cardNumberDisplay: '', name: '', expiry: '', cvv: '' }
            this.sheetError = ''
            this.showSheet = true
        },
        closeSheet() {
            this.showSheet = false
        },
        onCardNumberInput(e) {
            const digits = e.target.value.replace(/\D/g, '').slice(0, 16)
            this.form.cardNumberDisplay = digits.replace(/(.{4})/g, '$1 ').trim()
        },
        onExpiryInput(e) {
            let val = e.target.value.replace(/\D/g, '')
            if (val.length >= 3) val = val.slice(0, 2) + '/' + val.slice(2, 4)
            this.form.expiry = val
        },
        async handleAdd() {
            this.sheetError = ''
            const cardNumber = this.form.cardNumberDisplay.replace(/\s/g, '')
            const { name, expiry, cvv } = this.form
            if (!cardNumber || !name || !expiry || !cvv) {
                this.sheetError = 'กรุณากรอกข้อมูลให้ครบ'
                return
            }
            if (!/^\d{16}$/.test(cardNumber)) {
                this.sheetError = 'หมายเลขบัตรต้องมี 16 หลัก'
                return
            }
            if (!/^\d{2}\/\d{2}$/.test(expiry)) {
                this.sheetError = 'รูปแบบวันหมดอายุไม่ถูกต้อง (MM/YY)'
                return
            }
            if (!/^\d{3,4}$/.test(cvv)) {
                this.sheetError = 'CVV ต้องมี 3-4 หลัก'
                return
            }
            const [mm, yy] = expiry.split('/')
            this.adding = true
            try {
                const token = await new Promise((resolve, reject) => {
                    window.Omise.setPublicKey(import.meta.env.VITE_OMISE_PUBLIC_KEY)
                    window.Omise.createToken('card', {
                        name: name.toUpperCase(),
                        number: cardNumber,
                        expiration_month: parseInt(mm),
                        expiration_year: 2000 + parseInt(yy),
                        security_code: cvv,
                    }, (statusCode, response) => {
                        if (response.object === 'error') reject(new Error(response.message))
                        else resolve(response.id)
                    })
                })
                await usePaymentStore().addCard(this.userId, token)
                this.showSheet = false
            } catch (e) {
                this.sheetError = e.message || 'ไม่สามารถเพิ่มบัตรได้ กรุณาลองใหม่'
            } finally {
                this.adding = false
            }
        },
        async handleSetPrimary(id) {
            await usePaymentStore().setPrimary(this.userId, id)
        },
        async handleDelete(id) {
            if (!confirm('ต้องการลบบัตรนี้ใช่ไหม?')) return
            await usePaymentStore().deleteCard(this.userId, id)
        },
    },
}
</script>

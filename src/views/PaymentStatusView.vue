<template>
    <div class="min-h-screen bg-white flex flex-col">

        <!-- Card processing (no QR, pending) -->
        <div v-if="!qrImage && (orderStatus === 'pending' || !orderStatus)" class="flex-1 flex flex-col items-center justify-center text-center px-8 gap-4">
            <div class="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center">
                <div class="w-10 h-10 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
            </div>
            <h3 class="text-lg font-bold text-gray-900">กำลังตรวจสอบการชำระเงิน</h3>
            <p class="text-sm text-gray-400">กรุณารอสักครู่...</p>
        </div>

        <!-- QR pending -->
        <template v-else-if="!timerExpired && qrImage && (orderStatus === 'pending' || !orderStatus)">
            <div class="flex-1 flex flex-col items-center justify-center gap-5 px-8 py-6">

                <p class="text-3xl font-extrabold text-gray-900">฿{{ Number(amount).toLocaleString() }}</p>

                <!-- Countdown timer -->
                <div class="relative w-20 h-20">
                    <svg viewBox="0 0 100 100" class="w-full h-full -rotate-90">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="#f3f4f6" stroke-width="8"/>
                        <circle cx="50" cy="50" r="42" fill="none"
                            :stroke="timerColor"
                            stroke-width="8"
                            stroke-linecap="round"
                            :stroke-dasharray="circumference"
                            :stroke-dashoffset="dashOffset"
                        />
                    </svg>
                    <div class="absolute inset-0 flex flex-col items-center justify-center">
                        <span class="text-base font-extrabold font-mono text-gray-800">{{ formattedTime }}</span>
                        <span class="text-[10px] text-gray-400">เหลือเวลา</span>
                    </div>
                </div>

                <!-- QR image -->
                <img :src="qrImage" alt="PromptPay QR" class="w-full max-w-[220px] rounded-2xl border border-gray-100 shadow-sm" />

                <button @click="saveQR" class="text-xs text-gray-400 underline">บันทึก QR Code</button>

                <div class="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold bg-amber-50 text-amber-500">
                    <div class="w-3.5 h-3.5 border-2 border-amber-200 border-t-amber-500 rounded-full animate-spin shrink-0"></div>
                    รอการสแกน...
                </div>

                <button @click="cancelOrder" class="text-gray-400 text-xs">ยกเลิกและกลับหน้าแรก</button>
            </div>
        </template>

        <!-- Success -->
        <div v-else-if="orderStatus === 'success'" class="flex-1 flex flex-col items-center justify-center text-center px-8 gap-4">
            <div class="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900">ชำระเงินสำเร็จ!</h3>
            <p class="text-sm text-gray-500">เราจะเตรียมสินค้าและจัดส่งให้เร็วๆ นี้</p>
            <button @click="$router.push('/')" class="mt-2 bg-gray-800 text-white px-8 py-3.5 rounded-xl font-bold">กลับหน้าแรก</button>
        </div>

        <!-- Expired -->
        <div v-else-if="timerExpired || orderStatus === 'expired'" class="flex-1 flex flex-col items-center justify-center text-center px-8 gap-4">
            <div class="text-6xl">⏳</div>
            <h3 class="text-xl font-bold text-gray-800">หมดเวลาชำระเงิน</h3>
            <p class="text-sm text-gray-400">QR Code หมดอายุแล้ว กรุณาสั่งซื้อใหม่อีกครั้ง</p>
            <button @click="$router.push('/cart')" class="bg-gray-800 text-white px-8 py-3.5 rounded-xl font-bold">กลับตะกร้า</button>
        </div>

        <!-- Failed -->
        <div v-else-if="orderStatus === 'failed'" class="flex-1 flex flex-col items-center justify-center text-center px-8 gap-4">
            <div class="text-6xl">❌</div>
            <h3 class="text-xl font-bold text-gray-800">การชำระเงินไม่สำเร็จ</h3>
            <p class="text-sm text-gray-400">กรุณาลองใหม่อีกครั้ง</p>
            <button @click="$router.push('/cart')" class="bg-gray-800 text-white px-8 py-3.5 rounded-xl font-bold">กลับตะกร้า</button>
        </div>

    </div>
</template>

<script>
import { usePaymentStore } from '../stores/payment'
import { useOrdersStore } from '../stores/orders'

const PENDING_EXPIRY_SECONDS = 15 * 60
const POLL_INTERVAL_MS = 15_000

export default {
    name: 'PaymentStatusView',
    data() {
        return {
            orderId: '',
            qrImage: '',
            amount: 0,
            timeLeft: PENDING_EXPIRY_SECONDS,
            totalSeconds: PENDING_EXPIRY_SECONDS,
            timerInterval: null,
            pollInterval: null,
            timerExpired: false,
        }
    },
    computed: {
        orderStatus() {
            return usePaymentStore().currentOrderStatus
        },
        createdAt() {
            return usePaymentStore().currentOrderCreatedAt
        },
        formattedTime() {
            const mins = Math.floor(this.timeLeft / 60)
            const secs = this.timeLeft % 60
            return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
        },
        circumference() {
            return 2 * Math.PI * 42
        },
        dashOffset() {
            return this.circumference * (1 - this.timeLeft / this.totalSeconds)
        },
        timerColor() {
            const ratio = this.timeLeft / this.totalSeconds
            if (ratio > 0.5) return '#22c55e'
            if (ratio > 0.2) return '#f59e0b'
            return '#ef4444'
        },
    },
    watch: {
        orderStatus(newStatus) {
            if (['success', 'failed', 'expired'].includes(newStatus)) {
                this.cleanup()
            }
        },
        createdAt(newDate) {
            if (newDate && !this.timerInterval && this.qrImage) {
                this.startTimer(newDate)
            }
        },
    },
    created() {
        this.orderId = this.$route.query.orderId || ''
        this.qrImage = this.$route.query.qrImage || ''
        this.amount = this.$route.query.amount || 0

        if (!this.orderId) {
            this.$router.replace('/')
            return
        }

        usePaymentStore().listenToOrder(this.orderId)
        this.startPolling()
        document.addEventListener('visibilitychange', this.handleVisibilityChange)
    },
    beforeUnmount() {
        this.cleanup()
        usePaymentStore().stopOrderListener()
    },
    methods: {
        startTimer(createdAt) {
            if (this.timerInterval) clearInterval(this.timerInterval)
            const tick = () => {
                const elapsed = Math.floor((Date.now() - createdAt) / 1000)
                this.timeLeft = Math.max(0, PENDING_EXPIRY_SECONDS - elapsed)
                if (this.timeLeft <= 0) {
                    clearInterval(this.timerInterval)
                    this.timerInterval = null
                    this.timerExpired = true
                    setTimeout(() => usePaymentStore().pollOrderStatus(this.orderId), 3000)
                }
            }
            tick()
            this.timerInterval = setInterval(tick, 1000)
        },
        startPolling() {
            if (this.pollInterval) return
            this.pollInterval = setInterval(() => {
                if (this.orderStatus === 'pending' || !this.orderStatus) {
                    usePaymentStore().pollOrderStatus(this.orderId)
                } else {
                    this.stopPolling()
                }
            }, POLL_INTERVAL_MS)
        },
        stopPolling() {
            clearInterval(this.pollInterval)
            this.pollInterval = null
        },
        handleVisibilityChange() {
            if (document.visibilityState === 'visible' && (this.orderStatus === 'pending' || !this.orderStatus)) {
                usePaymentStore().pollOrderStatus(this.orderId)
            }
        },
        async cancelOrder() {
            await useOrdersStore().updatePaymentStatus(this.orderId, 'canceled')
            this.$router.push('/')
        },
        async saveQR() {
            try {
                const res = await fetch(this.qrImage)
                const blob = await res.blob()
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'promptpay-qr.png'
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                URL.revokeObjectURL(url)
            } catch (e) {
                console.error('Save QR failed:', e)
            }
        },
        cleanup() {
            if (this.timerInterval) { clearInterval(this.timerInterval); this.timerInterval = null }
            this.stopPolling()
            document.removeEventListener('visibilitychange', this.handleVisibilityChange)
        },
    },
}
</script>

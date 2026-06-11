<template>
    <div class="bg-[#f8f9fa] min-h-screen pb-24">

        <!-- Step progress bar -->
        <div class="px-8 pt-5 pb-4">
            <div class="flex items-center">
                <!-- Step 1 -->
                <div class="flex flex-col items-center gap-1.5" @click="step > 1 && (step = 1)">
                    <div class="w-9 h-9 rounded-full flex items-center justify-center"
                         :class="[step >= 1 ? 'bg-green-500' : 'bg-gray-200', step > 1 ? 'cursor-pointer' : '']">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="step >= 1 ? 'text-white' : 'text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <span class="text-xs font-semibold" :class="step >= 1 ? 'text-green-500' : 'text-gray-400'">สั่งซื้อ</span>
                </div>
                <div class="flex-1 h-px mb-5" :class="step >= 2 ? 'bg-green-500' : 'bg-gray-300'"></div>
                <!-- Step 2 -->
                <div class="flex flex-col items-center gap-1.5" @click="step > 2 && (step = 2)">
                    <div class="w-9 h-9 rounded-full flex items-center justify-center"
                         :class="[step >= 2 ? 'bg-green-500' : 'bg-gray-200', step > 2 ? 'cursor-pointer' : '']">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="step >= 2 ? 'text-white' : 'text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                    </div>
                    <span class="text-xs font-semibold" :class="step >= 2 ? 'text-green-500' : 'text-gray-400'">ชำระเงิน</span>
                </div>
                <div class="flex-1 h-px mb-5" :class="step >= 3 ? 'bg-green-500' : 'bg-gray-300'"></div>
                <!-- Step 3 -->
                <div class="flex flex-col items-center gap-1.5">
                    <div class="w-9 h-9 rounded-full flex items-center justify-center"
                         :class="step >= 3 ? 'bg-green-500' : 'bg-gray-200'">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="step >= 3 ? 'text-white' : 'text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <span class="text-xs font-semibold" :class="step >= 3 ? 'text-green-500' : 'text-gray-400'">เสร็จสิ้น</span>
                </div>
            </div>
        </div>

        <!-- Step 1: Review order -->
        <template v-if="step === 1">

            <!-- Address section -->
            <div class="px-4 mb-3">
                <p class="text-brand font-bold text-sm mb-2">ที่อยู่จัดส่ง</p>

                <div v-if="selectedAddress"
                     @click="openAddressSheet"
                     class="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3 flex items-start gap-3 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-brand mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-gray-800">{{ selectedAddress.name }}</p>
                        <p class="text-xs text-gray-500 mt-0.5 leading-relaxed">{{ fullAddress(selectedAddress) }}</p>
                        <p class="text-xs text-gray-500">{{ selectedAddress.phone }}</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </div>

                <div v-else class="bg-white rounded-2xl border border-dashed border-gray-300 px-4 py-5 flex flex-col items-center gap-2">
                    <p class="text-sm text-gray-400">ยังไม่มีที่อยู่ที่บันทึกไว้</p>
                    <router-link to="/profile/address/new" class="text-sm text-brand font-semibold">+ เพิ่มที่อยู่</router-link>
                </div>

                <p v-if="addressError" class="text-red-500 text-xs mt-1.5">{{ addressError }}</p>
            </div>

            <!-- Items section -->
            <div class="px-4 mb-3">
                <p class="text-brand font-bold text-sm mb-2">รายการสินค้า</p>

                <div v-if="items.length === 0" class="bg-white rounded-2xl border border-gray-100 py-10 flex items-center justify-center">
                    <p class="text-sm text-gray-400">ไม่มีสินค้าในตะกร้า</p>
                </div>

                <div v-else class="flex flex-col gap-3">
                    <div v-for="item in items" :key="item.key"
                         class="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3 flex items-center gap-3">
                        <img :src="item.imageUrl" :alt="item.title"
                             class="w-16 h-16 rounded-xl object-cover shrink-0 bg-gray-100" />
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-semibold text-gray-800 leading-snug">{{ item.title }}</p>
                            <p v-if="item.variantLabel" class="text-xs text-gray-400 mt-0.5">{{ item.variantLabel }}</p>
                            <p class="text-sm font-bold text-gray-900 mt-1">฿{{ item.price.toLocaleString() }}</p>
                        </div>
                        <div class="flex flex-col items-end gap-2 shrink-0">
                            <button @click="removeItem(item.key)" class="text-gray-300">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <div class="flex items-center gap-2">
                                <button @click="decrement(item.key)"
                                        class="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700 font-bold text-base leading-none">−</button>
                                <span class="text-sm font-semibold text-gray-800 w-5 text-center">{{ item.quantity }}</span>
                                <button @click="increment(item)"
                                        class="w-7 h-7 rounded-lg bg-gray-800 flex items-center justify-center text-white font-bold text-base leading-none">+</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Total + CTA -->
            <div class="px-4">
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-4 mb-4 space-y-2">
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-500">สินค้ารวม</span>
                        <span class="text-sm text-gray-900">฿{{ total.toLocaleString() }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-500">ค่าจัดส่ง</span>
                        <span v-if="shippingLoading" class="text-sm text-gray-400">กำลังคำนวณ...</span>
                        <span v-else-if="shippingError" class="text-xs text-red-400">{{ shippingError }}</span>
                        <span v-else-if="shippingCost !== null" class="text-sm text-gray-900">฿{{ shippingCost.toLocaleString() }}</span>
                        <span v-else class="text-sm text-gray-400">—</span>
                    </div>
                    <div class="flex justify-between items-center pt-2 border-t border-gray-100">
                        <span class="text-base font-bold text-gray-900">รวมทั้งหมด</span>
                        <span class="text-base font-bold text-gray-900">฿{{ grandTotal.toLocaleString() }}</span>
                    </div>
                </div>
                <button
                    @click="goToPayment"
                    :disabled="items.length === 0 || shippingLoading"
                    class="w-full bg-gray-800 text-white py-4 rounded-2xl text-sm font-bold disabled:opacity-40"
                >เลือกวิธีชำระเงิน</button>
            </div>

        </template>

        <!-- Step 2: Payment -->
        <template v-if="step === 2">
            <div class="px-4">
                <p class="text-brand font-bold text-sm mb-4">เลือกวิธีชำระเงิน</p>

                <!-- QR Code option -->
                <div class="bg-white rounded-2xl shadow-sm border mb-3 overflow-hidden transition-colors"
                     :class="paymentMethod === 'qr' ? 'border-green-400' : 'border-gray-100'">
                    <div @click="paymentMethod = 'qr'"
                         class="flex items-center gap-3 px-4 py-4 cursor-pointer">
                        <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                             :class="paymentMethod === 'qr' ? 'bg-green-50' : 'bg-gray-100'">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :class="paymentMethod === 'qr' ? 'text-green-500' : 'text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                            </svg>
                        </div>
                        <span class="flex-1 text-sm font-semibold"
                              :class="paymentMethod === 'qr' ? 'text-gray-900' : 'text-gray-500'">สแกนคิวอาร์โค้ด</span>
                        <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                             :class="paymentMethod === 'qr' ? 'border-green-500' : 'border-gray-300'">
                            <div v-if="paymentMethod === 'qr'" class="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                        </div>
                    </div>

                    <!-- QR expanded content -->
                    <div v-if="paymentMethod === 'qr'" class="border-t border-gray-100 px-4 py-4 flex flex-col items-center gap-3">
                        <div class="w-40 h-40 bg-gray-50 rounded-2xl flex items-center justify-center border border-dashed border-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                            </svg>
                        </div>
                        <p class="text-xs text-gray-400">กดปุ่มด้านล่างเพื่อสร้าง QR PromptPay</p>
                        <p class="text-sm font-bold text-gray-800">฿{{ grandTotal.toLocaleString() }}</p>
                    </div>
                </div>

                <!-- Credit card option -->
                <div class="bg-white rounded-2xl shadow-sm border mb-4 overflow-hidden transition-colors"
                     :class="paymentMethod === 'card' ? 'border-green-400' : 'border-gray-100'">
                    <div @click="paymentMethod = 'card'"
                         class="flex items-center gap-3 px-4 py-4 cursor-pointer">
                        <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                             :class="paymentMethod === 'card' ? 'bg-green-50' : 'bg-gray-100'">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :class="paymentMethod === 'card' ? 'text-green-500' : 'text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                        <span class="flex-1 text-sm font-semibold"
                              :class="paymentMethod === 'card' ? 'text-gray-900' : 'text-gray-500'">บัตรเครดิต / บัตรเดบิต</span>
                        <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                             :class="paymentMethod === 'card' ? 'border-green-500' : 'border-gray-300'">
                            <div v-if="paymentMethod === 'card'" class="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                        </div>
                    </div>

                    <!-- Card expanded content -->
                    <div v-if="paymentMethod === 'card'" class="border-t border-gray-100 px-4 py-3">
                        <div v-if="selectedCard"
                             @click.stop="openCardSheet"
                             class="flex items-center gap-3 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-brand shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-semibold text-gray-800">**** **** **** {{ selectedCard.last4 }}</p>
                                <p class="text-xs text-gray-400 mt-0.5">{{ selectedCard.brand }} · {{ selectedCard.expiryMonth }}/{{ String(selectedCard.expiryYear).slice(-2) }}</p>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                        <div v-else class="flex flex-col items-center gap-2 py-2">
                            <p class="text-sm text-gray-400">ยังไม่มีบัตรที่บันทึกไว้</p>
                            <router-link to="/profile/payment" class="text-sm text-brand font-semibold">+ เพิ่มบัตร</router-link>
                        </div>
                    </div>
                </div>

                <!-- CTA -->
                <button
                    @click="confirmPayment"
                    :disabled="(paymentMethod === 'card' && !selectedCard) || submitting"
                    class="w-full bg-gray-800 text-white py-4 rounded-2xl text-sm font-bold disabled:opacity-40"
                >
                    <template v-if="submitting">กำลังสร้าง QR...</template>
                    <template v-else-if="paymentMethod === 'qr'">สร้าง QR Code</template>
                    <template v-else>ยืนยันการชำระเงิน</template>
                </button>
                <p v-if="orderError" class="mt-2 text-red-500 text-xs text-center">{{ orderError }}</p>
            </div>
        </template>

        <!-- Step 3: Confirmation -->
        <template v-if="step === 3">
            <div class="flex flex-col items-center justify-center mt-20 px-4 text-center">
                <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <p class="text-xl font-bold text-gray-900">สั่งซื้อสำเร็จ!</p>
                <p class="text-gray-500 text-sm mt-1">เราจะติดต่อกลับเร็วๆ นี้</p>
                <router-link to="/" class="mt-6 text-gray-800 underline text-sm font-medium">ช้อปต่อ</router-link>
            </div>
        </template>

        <!-- Address sheet overlay -->
        <div v-if="showAddressSheet" class="fixed inset-0 bg-black/40 z-40" @click="closeAddressSheet" />

        <!-- Address bottom sheet -->
        <div v-if="showAddressSheet" class="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 px-5 pt-5 pb-8">
            <div class="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h2 class="text-base font-bold text-gray-900 mb-4">เลือกที่อยู่จัดส่ง</h2>
            <div class="flex flex-col gap-3 max-h-72 overflow-y-auto">
                <div
                    v-for="addr in addresses"
                    :key="addr.id"
                    @click="selectAddress(addr.id)"
                    class="flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors"
                    :class="selectedAddressId === addr.id ? 'border-brand bg-brand/5' : 'border-gray-200'"
                >
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2">
                            <span class="text-sm font-semibold text-gray-800">{{ addr.name }}</span>
                            <span v-if="addr.isPrimary" class="text-[10px] font-semibold text-white bg-brand px-1.5 py-0.5 rounded-full">หลัก</span>
                        </div>
                        <p class="text-xs text-gray-500 mt-0.5 leading-relaxed">{{ fullAddress(addr) }}</p>
                        <p class="text-xs text-gray-500">{{ addr.phone }}</p>
                    </div>
                    <svg v-if="selectedAddressId === addr.id"
                         xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-brand shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            </div>
            <router-link to="/profile/address/new" class="block mt-4 text-center text-sm text-brand font-semibold">
                + เพิ่มที่อยู่ใหม่
            </router-link>
        </div>

        <!-- Card sheet overlay -->
        <div v-if="showCardSheet" class="fixed inset-0 bg-black/40 z-40" @click="closeCardSheet" />

        <!-- Card bottom sheet -->
        <div v-if="showCardSheet" class="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 px-5 pt-5 pb-8">
            <div class="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h2 class="text-base font-bold text-gray-900 mb-4">เลือกบัตร</h2>
            <div class="flex flex-col gap-3 max-h-72 overflow-y-auto">
                <div
                    v-for="card in cards"
                    :key="card.id"
                    @click="selectCard(card.id)"
                    class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors"
                    :class="selectedCardId === card.id ? 'border-brand bg-brand/5' : 'border-gray-200'"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" :class="selectedCardId === card.id ? 'text-brand' : 'text-gray-300'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2">
                            <span class="text-sm font-semibold text-gray-800">**** **** **** {{ card.last4 }}</span>
                            <span v-if="card.isPrimary" class="text-[10px] font-semibold text-white bg-brand px-1.5 py-0.5 rounded-full">หลัก</span>
                        </div>
                        <p class="text-xs text-gray-400 mt-0.5">{{ card.brand }} · {{ card.expiryMonth }}/{{ String(card.expiryYear).slice(-2) }}</p>
                    </div>
                    <svg v-if="selectedCardId === card.id"
                         xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-brand shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            </div>
            <router-link to="/profile/payment" class="block mt-4 text-center text-sm text-brand font-semibold">
                + เพิ่มบัตรใหม่
            </router-link>
        </div>

    </div>
</template>

<script>
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { useAddressStore } from '../stores/address'
import { usePaymentStore } from '../stores/payment'
import { useOrdersStore } from '../stores/orders'
import { useProductsStore } from '../stores/products'
import { SHOP_AREA_CODE, getFlashAreaCode } from '../constants/flashAreaCodes'

export default {
    name: 'CheckoutView',
    data() {
        return {
            step: 1,
            selectedAddressId: null,
            showAddressSheet: false,
            addressError: '',
            shippingCost: null,
            shippingLoading: false,
            shippingError: '',
            paymentMethod: 'qr',
            selectedCardId: null,
            showCardSheet: false,
            submitting: false,
            orderError: '',
        }
    },
    computed: {
        items()     { return useCartStore().items },
        total()     { return useCartStore().total },
        addresses() { return useAddressStore().addresses },
        cards()     { return usePaymentStore().cards },
        selectedAddress() {
            return this.addresses.find((a) => a.id === this.selectedAddressId) ?? null
        },
        selectedCard() {
            return this.cards.find((c) => c.id === this.selectedCardId) ?? null
        },
        grandTotal() {
            return this.total + (this.shippingCost ?? 0)
        },
    },
    watch: {
        items: {
            deep: true,
            handler() { this.fetchShippingCost() },
        },
    },
    mounted() {
        const auth = useAuthStore()
        if (!auth.isAuthenticated) {
            this.$router.replace('/login?redirect=/checkout')
            return
        }
        const addressStore = useAddressStore()
        const initAddress = () => {
            const primary = addressStore.primaryAddress
            if (primary) {
                this.selectedAddressId = primary.id
                this.fetchShippingCost()
            }
        }
        if (addressStore.addresses.length > 0) {
            initAddress()
        } else {
            addressStore.fetchAddresses(auth.user.id).then(initAddress)
        }
        usePaymentStore().fetchCards(auth.user.id)
    },
    methods: {
        fullAddress(addr) {
            if (addr.detail) {
                return [addr.detail, addr.subdistrict, addr.district, addr.province, addr.postalCode]
                    .filter(Boolean).join(' ')
            }
            return addr.address || ''
        },
        increment(item) {
            useCartStore().addItem({ ...item })
        },
        decrement(key) {
            useCartStore().decrementItem(key)
        },
        removeItem(key) {
            useCartStore().removeItem(key)
        },
        openAddressSheet() {
            this.showAddressSheet = true
        },
        closeAddressSheet() {
            this.showAddressSheet = false
        },
        selectAddress(id) {
            this.selectedAddressId = id
            this.showAddressSheet = false
            this.fetchShippingCost()
        },
        openCardSheet() {
            this.showCardSheet = true
        },
        closeCardSheet() {
            this.showCardSheet = false
        },
        selectCard(id) {
            this.selectedCardId = id
            this.showCardSheet = false
        },
        async fetchShippingCost() {
            if (!this.selectedAddress || this.items.length === 0) return
            const addr = this.selectedAddress
            const dstArea = getFlashAreaCode(addr.subdistrict, addr.postalCode)
            if (!dstArea) {
                this.shippingCost = null
                this.shippingError = 'ไม่พบรหัสพื้นที่'
                return
            }
            const productsStore = useProductsStore()
            let totalWeightKg = 0
            let maxL = 0, maxW = 0, totalH = 0
            for (const item of this.items) {
                const product = productsStore.getById(item.productId)
                const w = product?.weight || 0
                const l = product?.dimensionLength || 0
                const ww = product?.dimensionWidth || 0
                const h = product?.dimensionHeight || 0
                totalWeightKg += (w * item.quantity) / 1000
                for (let i = 0; i < item.quantity; i++) {
                    maxL = Math.max(maxL, l)
                    maxW = Math.max(maxW, ww)
                    totalH += h
                }
            }
            const weight = Math.max(totalWeightKg, 0.01)
            const length = Math.max(maxL, 1)
            const width = Math.max(maxW, 1)
            const height = Math.max(totalH, 1)
            this.shippingLoading = true
            this.shippingError = ''
            try {
                const url = `https://www.flashexpress.co.th/webApi/tools/freightCharge?express_category=1&weight=${weight}&length=${length}&width=${width}&height=${height}&src_area=${SHOP_AREA_CODE}&dst_area=${dstArea}`
                const res = await fetch(url)
                const json = await res.json()
                if (json.code === 1 && json.data?.[0]?.paid_by_sender) {
                    const s = json.data[0].paid_by_sender
                    this.shippingCost = (s.parcel_amount + s.fuel_surcharge_amount) / 100
                } else {
                    this.shippingCost = null
                    this.shippingError = 'ไม่สามารถคำนวณค่าจัดส่งได้'
                }
            } catch {
                this.shippingCost = null
                this.shippingError = 'ไม่สามารถคำนวณค่าจัดส่งได้'
            } finally {
                this.shippingLoading = false
            }
        },
        goToPayment() {
            if (!this.selectedAddress) {
                this.addressError = 'กรุณาเลือกที่อยู่จัดส่ง'
                return
            }
            this.addressError = ''
            const primary = usePaymentStore().primaryCard
            if (primary) this.selectedCardId = primary.id
            this.step = 2
        },
        confirmPayment() {
            if (this.paymentMethod === 'qr') {
                this.submitQrPayment()
            } else {
                this.submitOrder()
            }
        },
        createPromptPaySource() {
            return new Promise((resolve, reject) => {
                window.Omise.setPublicKey(import.meta.env.VITE_OMISE_PUBLIC_KEY)
                window.Omise.createSource(
                    'promptpay',
                    { amount: Math.round(this.grandTotal * 100), currency: 'THB' },
                    (statusCode, response) => {
                        if (statusCode === 200) resolve(response)
                        else reject(new Error(response.message || 'ไม่สามารถสร้าง QR Code ได้'))
                    }
                )
            })
        },
        async submitQrPayment() {
            this.submitting = true
            this.orderError = ''
            try {
                const source = await this.createPromptPaySource()
                const auth = useAuthStore()
                const cartStore = useCartStore()
                const data = await usePaymentStore().createQrCharge({
                    source: source.id,
                    items: cartStore.items.map((item) => ({
                        key: item.key,
                        productId: item.productId,
                        variantId: item.variantId,
                        variantLabel: item.variantLabel || null,
                        title: item.title,
                        quantity: item.quantity,
                        imageUrl: item.imageUrl || null,
                    })),
                    address: {
                        name: this.selectedAddress.name,
                        phone: this.selectedAddress.phone,
                        fullAddress: this.fullAddress(this.selectedAddress),
                    },
                    shippingCost: this.shippingCost ?? 0,
                    userId: auth.user.id,
                })
                cartStore.clearCart()
                this.$router.push({
                    path: '/payment',
                    query: {
                        orderId: data.orderId,
                        qrImage: data.qrImage,
                        amount: String(data.amount),
                    },
                })
            } catch (e) {
                console.error('[checkout] QR payment error:', e)
                this.orderError = e.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่'
            } finally {
                this.submitting = false
            }
        },
        async submitOrder() {
            const auth = useAuthStore()
            const cartStore = useCartStore()
            this.submitting = true
            this.orderError = ''
            try {
                await useOrdersStore().createOrder({
                    customerName: this.selectedAddress.name,
                    phone: this.selectedAddress.phone,
                    address: this.fullAddress(this.selectedAddress),
                    note: '',
                    items: cartStore.items,
                    userId: auth.user.id,
                    userProvider: auth.user.provider ?? null,
                })
                cartStore.clearCart()
                this.step = 3
            } catch (e) {
                this.orderError = e.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่'
            } finally {
                this.submitting = false
            }
        },
    },
}
</script>

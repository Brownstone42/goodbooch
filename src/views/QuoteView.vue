<template>
    <div class="bg-[#f8f9fa] min-h-full pb-2">
        <!-- ===== SUCCESS STATE ===== -->
        <div
            v-if="store.submitted"
            class="flex flex-col items-center justify-center px-6 pt-24 text-center"
        >
            <div class="w-20 h-20 bg-brand rounded-full flex items-center justify-center mb-5">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-10 w-10 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h2 class="text-xl font-bold text-gray-900">ส่งใบเสนอราคาเรียบร้อยแล้ว</h2>
            <p class="text-sm text-gray-500 mt-2">ทีมงานจะติดต่อกลับภายใน 24–28 ชั่วโมง</p>
            <p class="text-xs text-gray-400 mt-1">หรือติดต่อสอบถามผ่านทาง LineOA @Goodbooch</p>
            <button
                @click="store.reset()"
                class="mt-8 px-8 py-3 bg-brand text-white rounded-xl font-semibold text-sm"
            >
                ส่งใบเสนอราคาใหม่
            </button>
        </div>

        <!-- ===== FORM ===== -->
        <div v-else>
            <!-- Page header -->
            <div class="px-4 pt-5 pb-4">
                <h1 class="text-xl font-bold text-gray-900">ขอใบเสนอราคา</h1>
                <p class="text-xs text-gray-400 mt-0.5">กรุณากรอกข้อมูลเพื่อขอใบเสนอราคาสินค้า</p>
            </div>

            <div class="px-4 flex flex-col gap-4">
                <!-- ─────────────────────────────────── -->
                <!-- Section 1: ข้อมูลบริษัท -->
                <!-- ─────────────────────────────────── -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="flex items-center gap-2 px-4 py-3 bg-brand">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4 text-white shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                        </svg>
                        <span class="text-sm font-bold text-white">ข้อมูลบริษัท</span>
                    </div>
                    <div class="px-4 py-4 flex flex-col gap-3">
                        <div>
                            <label
                                class="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide"
                                >ชื่อบริษัท</label
                            >
                            <input
                                :value="store.company.name"
                                @input="store.company.name = $event.target.value"
                                type="text"
                                placeholder="ระบุชื่อบริษัทหรือองค์กร"
                                class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-brand transition-colors"
                            />
                        </div>
                        <div>
                            <label
                                class="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide"
                                >ชื่อผู้ติดต่อ</label
                            >
                            <input
                                :value="store.company.contact"
                                @input="store.company.contact = $event.target.value"
                                type="text"
                                placeholder="ชื่อ-นามสกุล"
                                class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-brand transition-colors"
                            />
                        </div>
                        <div>
                            <label
                                class="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide"
                                >เบอร์ติดต่อ</label
                            >
                            <input
                                :value="store.company.phone"
                                @input="store.company.phone = $event.target.value"
                                type="tel"
                                placeholder="02-xxx-xxxx"
                                class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-brand transition-colors"
                            />
                        </div>
                        <div>
                            <label
                                class="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide"
                                >อีเมล</label
                            >
                            <input
                                :value="store.company.email"
                                @input="store.company.email = $event.target.value"
                                type="email"
                                placeholder="example@company.com"
                                class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-brand transition-colors"
                            />
                        </div>
                    </div>
                </div>

                <!-- ─────────────────────────────────── -->
                <!-- Section 2: รายละเอียดสินค้า -->
                <!-- ─────────────────────────────────── -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="flex items-center gap-2 px-4 py-3 bg-brand">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4 text-white shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                        </svg>
                        <span class="text-sm font-bold text-white">รายละเอียดสินค้าที่ต้องการ</span>
                    </div>

                    <div class="px-4 py-4 flex flex-col gap-5">
                        <!-- Each product entry -->
                        <div
                            v-for="(product, i) in store.products"
                            :key="i"
                            class="flex flex-col gap-3 pb-5"
                            :class="i < store.products.length - 1 ? 'border-b border-gray-100' : ''"
                        >
                            <!-- Header row: "สินค้าที่ N" + remove button -->
                            <div class="flex items-center justify-between">
                                <span class="text-xs font-bold text-brand uppercase tracking-wide"
                                    >สินค้าที่ {{ i + 1 }}</span
                                >
                                <button
                                    v-if="store.products.length > 1"
                                    @click="store.removeProduct(i)"
                                    class="text-xs text-gray-400 flex items-center gap-1 hover:text-red-400 transition-colors"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="h-3.5 w-3.5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        stroke-width="2"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                    ลบ
                                </button>
                            </div>

                            <!-- Reference product (optional) -->
                            <div>
                                <label
                                    class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide"
                                    >สินค้าอ้างอิง
                                    <span class="font-normal normal-case text-gray-400"
                                        >(ไม่บังคับ)</span
                                    ></label
                                >

                                <!-- Selected reference -->
                                <div
                                    v-if="product.refProduct"
                                    class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200"
                                >
                                    <img
                                        :src="product.refProduct.imageUrl || '/images/mask.png'"
                                        :alt="product.refProduct.title"
                                        class="w-12 h-12 rounded-lg object-cover shrink-0 bg-gray-200"
                                    />
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-semibold text-gray-800 truncate">
                                            {{ product.refProduct.title }}
                                        </p>
                                        <button
                                            @click="store.clearProductRef(i)"
                                            class="text-xs text-gray-400 hover:text-red-400 transition-colors mt-0.5"
                                        >
                                            ลบรูปอ้างอิง
                                        </button>
                                    </div>
                                </div>

                                <!-- Select button -->
                                <button
                                    v-else
                                    @click="handleSelectRef(i)"
                                    class="w-full flex items-center justify-center gap-2 border border-dashed border-gray-300 rounded-xl py-3 text-sm text-gray-500 hover:border-brand hover:text-brand transition-colors"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        stroke-width="2"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    เลือกสินค้าที่อยู่ในฐานข้อมูล
                                </button>
                            </div>

                            <!-- Description -->
                            <div>
                                <label
                                    class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide"
                                    >รายละเอียดสินค้า</label
                                >
                                <textarea
                                    :value="product.description"
                                    @input="product.description = $event.target.value"
                                    rows="3"
                                    placeholder="ระบุสินค้า รุ่น สี แบ็ค และรายละเอียดที่ต้องการ&#10;เช่น Cleanroom Gloves M, Natural Rubber 100%"
                                    class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-brand transition-colors resize-none"
                                ></textarea>
                            </div>

                            <!-- Quantity -->
                            <div>
                                <label
                                    class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide"
                                    >จำนวน</label
                                >
                                <input
                                    :value="product.quantity"
                                    @input="product.quantity = $event.target.value"
                                    type="number"
                                    min="1"
                                    placeholder="จำนวนที่ต้องการ"
                                    class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-brand transition-colors"
                                />
                            </div>
                        </div>

                        <!-- Add product button -->
                        <button
                            v-if="store.products.length < 10"
                            @click="store.addProduct()"
                            class="w-full flex items-center justify-center gap-2 border border-dashed border-brand/40 rounded-xl py-3 text-sm text-brand font-medium hover:bg-brand/5 transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                stroke-width="2.5"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            เพิ่มสินค้า
                        </button>
                    </div>
                </div>

                <!-- ─────────────────────────────────── -->
                <!-- Section 3: หมายเหตุ -->
                <!-- ─────────────────────────────────── -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="flex items-center gap-2 px-4 py-3 bg-brand">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4 text-white shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                        </svg>
                        <span class="text-sm font-bold text-white">หมายเหตุเพิ่มเติม</span>
                    </div>
                    <div class="px-4 py-4">
                        <textarea
                            :value="store.note"
                            @input="store.note = $event.target.value"
                            rows="4"
                            placeholder="ข้อกำหนดทางเทคนิคเพิ่มเติม เช่น มาตรฐาน ISO Class, ESD Resistance, Natural Rubber 100% ฯลฯ"
                            class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-brand transition-colors resize-none"
                        ></textarea>
                    </div>
                </div>

                <!-- ─────────────────────────────────── -->
                <!-- Section 4: สรุปคำขอ -->
                <!-- ─────────────────────────────────── -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="flex items-center gap-2 px-4 py-3 bg-brand">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4 text-white shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                        </svg>
                        <span class="text-sm font-bold text-white">สรุปคำขอ</span>
                    </div>
                    <div class="px-4 py-4 flex flex-col gap-3">
                        <!-- Empty state -->
                        <p
                            v-if="store.products.every(p => !p.description && !p.refProduct)"
                            class="text-sm text-gray-400 text-center py-2"
                        >
                            ยังไม่มีรายการสินค้า — กรอกรายละเอียดในส่วนด้านบน
                        </p>

                        <!-- Product summary rows (only show products that have data) -->
                        <template v-for="(product, i) in store.products" :key="i">
                            <div v-if="product.description || product.refProduct" class="flex items-start gap-3">
                                <img
                                    :src="product.refProduct?.imageUrl || '/images/mask.png'"
                                    :alt="product.refProduct?.title || 'สินค้า'"
                                    class="w-14 h-14 rounded-xl object-cover shrink-0 bg-gray-100"
                                />
                                <div class="flex-1 min-w-0 pt-0.5">
                                    <p class="text-xs font-semibold text-brand truncate">
                                        {{
                                            product.refProduct
                                                ? product.refProduct.title
                                                : 'สินค้าที่ ' + (i + 1)
                                        }}
                                    </p>
                                    <p
                                        class="text-sm text-gray-700 mt-0.5 leading-relaxed line-clamp-2"
                                    >
                                        {{ product.description || '—' }}
                                    </p>
                                    <p class="text-xs text-gray-400 mt-0.5">
                                        จำนวน {{ product.quantity }}
                                    </p>
                                </div>
                            </div>
                        </template>

                        <!-- Error -->
                        <div
                            v-if="store.error"
                            class="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3"
                        >
                            {{ store.error }}
                        </div>

                        <!-- Submit button -->
                        <button
                            @click="handleSubmit"
                            :disabled="store.submitting || !store.isFormValid"
                            class="w-full bg-brand text-white py-4 rounded-2xl text-base font-semibold disabled:opacity-40 transition-opacity flex items-center justify-center gap-2 mt-1"
                        >
                            <span v-if="store.submitting" class="flex items-center gap-2">
                                <span
                                    class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"
                                ></span>
                                กำลังส่ง...
                            </span>
                            <span v-else class="flex items-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                    />
                                </svg>
                                ส่งใบเสนอราคา
                            </span>
                        </button>

                        <p class="text-center text-xs text-gray-400">
                            ระยะเวลาตอบกลับ 24–28 ชั่วโมง
                        </p>
                        <p class="text-center text-xs text-gray-400 -mt-2">
                            ติดต่อสอบถามผ่านทาง LineOA @Goodbooch
                        </p>
                    </div>
                </div>

                <!-- ─────────────────────────────────── -->
                <!-- Section 5: มาตรฐานความปลอดภัยข้อมูล -->
                <!-- ─────────────────────────────────── -->
                <div class="flex items-start gap-3 px-1 pb-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-8 w-8 text-brand shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="1.5"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                    </svg>
                    <div>
                        <p class="text-xs font-semibold text-gray-700">มาตรฐานความปลอดภัยข้อมูล</p>
                        <p class="text-xs text-gray-400 mt-1 leading-relaxed">
                            ข้อมูลของท่านได้รับการปกป้องตามมาตรฐานสากล
                            ข้อมูลส่วนบุคคลจะไม่ถูกเปิดเผยแก่บุคคลภายนอกโดยไม่ได้รับความยินยอม
                            ระบบรักษาความปลอดภัยข้อมูลตามมาตรฐาน ISO 27001
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useQuotationStore } from '../stores/quotation'

export default {
    name: 'QuoteView',
    computed: {
        store() {
            return useQuotationStore()
        },
    },
    mounted() {
        if (this.store.submitted) {
            this.store.reset()
        }
    },
    methods: {
        handleSelectRef(index) {
            this.store.startSelectingRef(index)
            this.$router.push('/categories?quoteMode=true')
        },
        async handleSubmit() {
            if (!this.store.isFormValid) return
            try {
                await this.store.submitQuotation()
            } catch {
                // error shown via store.error
            }
        },
    },
}
</script>

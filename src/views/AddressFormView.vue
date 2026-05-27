<template>
    <div class="bg-[#f8f9fa] min-h-full pb-8">

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
            <h1 class="text-xl font-bold text-gray-900">{{ pageTitle }}</h1>
        </div>

        <div class="px-4 mt-2 flex flex-col gap-4">

            <!-- ชื่อผู้รับ -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-5">
                <label class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">ชื่อผู้รับ</label>
                <input
                    v-model="form.name"
                    type="text"
                    placeholder="ชื่อ-นามสกุล"
                    class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-brand transition-colors"
                />
            </div>

            <!-- ที่อยู่ -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-5 flex flex-col gap-4">
                <p class="text-sm font-bold text-gray-800 -mb-1">ที่อยู่</p>

                <!-- รายละเอียด -->
                <div>
                    <label class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">รายละเอียด</label>
                    <input
                        v-model="form.detail"
                        type="text"
                        placeholder="บ้านเลขที่ / หมู่บ้าน / ถนน"
                        class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-brand transition-colors"
                    />
                </div>

                <!-- จังหวัด -->
                <div>
                    <label class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">จังหวัด</label>
                    <select
                        v-model="form.province"
                        @change="onProvinceChange"
                        class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-brand transition-colors bg-white appearance-none"
                    >
                        <option value="" disabled>-- เลือกจังหวัด --</option>
                        <option v-for="p in provinces" :key="p" :value="p">{{ p }}</option>
                    </select>
                </div>

                <!-- เขต/อำเภอ -->
                <div>
                    <label class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">เขต / อำเภอ</label>
                    <select
                        v-model="form.district"
                        @change="onDistrictChange"
                        :disabled="!form.province"
                        class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-brand transition-colors bg-white appearance-none disabled:opacity-40"
                    >
                        <option value="" disabled>-- เลือกเขต/อำเภอ --</option>
                        <option v-for="d in districts" :key="d" :value="d">{{ d }}</option>
                    </select>
                </div>

                <!-- แขวง/ตำบล -->
                <div>
                    <label class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">แขวง / ตำบล</label>
                    <select
                        v-model="form.subdistrict"
                        @change="onSubdistrictChange"
                        :disabled="!form.district"
                        class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-brand transition-colors bg-white appearance-none disabled:opacity-40"
                    >
                        <option value="" disabled>-- เลือกแขวง/ตำบล --</option>
                        <option v-for="s in subdistricts" :key="s.name" :value="s.name">{{ s.name }}</option>
                    </select>
                </div>

                <!-- รหัสไปรษณีย์ (auto-filled) -->
                <div>
                    <label class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">รหัสไปรษณีย์</label>
                    <input
                        :value="form.postalCode"
                        type="text"
                        readonly
                        placeholder="กรอกอัตโนมัติ"
                        class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 bg-gray-50 cursor-default"
                    />
                </div>
            </div>

            <!-- เบอร์ติดต่อ -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-5">
                <label class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">เบอร์ติดต่อ</label>
                <input
                    v-model="form.phone"
                    type="tel"
                    placeholder="0XX-XXX-XXXX"
                    class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-brand transition-colors"
                />
            </div>

            <!-- Error -->
            <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                {{ error }}
            </div>

            <!-- Save -->
            <button
                @click="handleSubmit"
                :disabled="loading || !isFormValid"
                class="w-full bg-brand text-white py-4 rounded-2xl text-base font-semibold disabled:opacity-40 transition-opacity"
            >
                <span v-if="loading" class="flex items-center justify-center gap-2">
                    <span class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                    กำลังบันทึก...
                </span>
                <span v-else>บันทึก</span>
            </button>

        </div>
    </div>
</template>

<script>
import { useAddressStore } from '../stores/address'
import { useAuthStore } from '../stores/auth'
import { getProvinces, getDistricts, getSubdistricts } from '../constants/thaiAddress'

export default {
    name: 'AddressFormView',
    data() {
        return {
            form: {
                name:        '',
                detail:      '',
                province:    '',
                district:    '',
                subdistrict: '',
                postalCode:  '',
                phone:       '',
            },
        }
    },
    computed: {
        isEdit()    { return !!this.$route.params.addressId },
        pageTitle() { return this.isEdit ? 'แก้ไขที่อยู่' : 'เพิ่มที่อยู่ใหม่' },
        loading()   { return useAddressStore().loading },
        error()     { return useAddressStore().error },
        userId()    { return useAuthStore().user?.id },
        provinces() { return getProvinces() },
        districts() {
            return this.form.province ? getDistricts(this.form.province) : []
        },
        subdistricts() {
            return (this.form.province && this.form.district)
                ? getSubdistricts(this.form.province, this.form.district)
                : []
        },
        isFormValid() {
            const f = this.form
            return f.name.trim() && f.detail.trim() && f.province &&
                   f.district && f.subdistrict && f.phone.trim()
        },
    },
    mounted() {
        if (!this.userId) {
            this.$router.replace('/login')
            return
        }
        if (this.isEdit) {
            const existing = useAddressStore().addresses.find(
                (a) => a.id === this.$route.params.addressId
            )
            if (existing) {
                this.form.name        = existing.name        || ''
                this.form.detail      = existing.detail      || ''
                this.form.province    = existing.province    || ''
                this.form.district    = existing.district    || ''
                this.form.subdistrict = existing.subdistrict || ''
                this.form.postalCode  = existing.postalCode  || ''
                this.form.phone       = existing.phone       || ''
            } else {
                this.$router.replace('/profile/address')
            }
        }
    },
    methods: {
        onProvinceChange() {
            this.form.district    = ''
            this.form.subdistrict = ''
            this.form.postalCode  = ''
        },
        onDistrictChange() {
            this.form.subdistrict = ''
            this.form.postalCode  = ''
        },
        onSubdistrictChange() {
            const match = this.subdistricts.find((s) => s.name === this.form.subdistrict)
            this.form.postalCode = match?.postalCode ?? ''
        },
        async handleSubmit() {
            if (!this.isFormValid) return
            const store = useAddressStore()
            const payload = {
                name:        this.form.name.trim(),
                detail:      this.form.detail.trim(),
                province:    this.form.province,
                district:    this.form.district,
                subdistrict: this.form.subdistrict,
                postalCode:  this.form.postalCode,
                phone:       this.form.phone.trim(),
            }
            try {
                if (this.isEdit) {
                    await store.updateAddress(this.userId, this.$route.params.addressId, payload)
                } else {
                    await store.addAddress(this.userId, payload)
                }
                this.$router.back()
            } catch {
                // error shown via computed
            }
        },
    },
}
</script>

import { defineStore } from 'pinia'
import {
    collection, addDoc, getDocs, doc,
    updateDoc, deleteDoc, serverTimestamp, query, orderBy,
} from 'firebase/firestore'
import { db } from '../firebase'

const MAX_ADDRESSES = 5

function addressesRef(userId) {
    return collection(db, 'users', userId, 'addresses')
}

function addressDocRef(userId, id) {
    return doc(db, 'users', userId, 'addresses', id)
}

export const useAddressStore = defineStore('address', {
    state: () => ({
        addresses: [],
        loading: false,
        error: null,
    }),
    getters: {
        primaryAddress: (state) =>
            state.addresses.find((a) => a.isPrimary) ?? state.addresses[0] ?? null,
    },
    actions: {
        async fetchAddresses(userId) {
            this.loading = true
            this.error = null
            try {
                const snapshot = await getDocs(
                    query(addressesRef(userId), orderBy('createdAt', 'asc'))
                )
                this.addresses = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
            } catch (e) {
                this.error = 'ไม่สามารถโหลดที่อยู่ได้'
            } finally {
                this.loading = false
            }
        },

        async addAddress(userId, data) {
            if (this.addresses.length >= MAX_ADDRESSES) {
                this.error = `จำกัดสูงสุด ${MAX_ADDRESSES} ที่อยู่ต่อหนึ่งบัญชีผู้ใช้`
                throw new Error(this.error)
            }
            this.loading = true
            this.error = null
            try {
                const isPrimary = this.addresses.length === 0
                const ref = await addDoc(addressesRef(userId), {
                    ...data,
                    isPrimary,
                    createdAt: serverTimestamp(),
                })
                this.addresses.push({ id: ref.id, ...data, isPrimary, createdAt: null })
            } catch (e) {
                this.error = 'ไม่สามารถเพิ่มที่อยู่ได้'
                throw e
            } finally {
                this.loading = false
            }
        },

        async updateAddress(userId, id, data) {
            this.loading = true
            this.error = null
            try {
                await updateDoc(addressDocRef(userId, id), data)
                const existing = this.addresses.find((a) => a.id === id)
                if (existing) Object.assign(existing, data)
            } catch (e) {
                this.error = 'ไม่สามารถแก้ไขที่อยู่ได้'
                throw e
            } finally {
                this.loading = false
            }
        },

        async deleteAddress(userId, id) {
            this.loading = true
            this.error = null
            try {
                const wasPrimary = this.addresses.find((a) => a.id === id)?.isPrimary ?? false
                await deleteDoc(addressDocRef(userId, id))
                this.addresses = this.addresses.filter((a) => a.id !== id)
                if (wasPrimary && this.addresses.length > 0) {
                    await this.setPrimary(userId, this.addresses[0].id)
                }
            } catch (e) {
                this.error = 'ไม่สามารถลบที่อยู่ได้'
            } finally {
                this.loading = false
            }
        },

        async setPrimary(userId, id) {
            this.loading = true
            this.error = null
            try {
                await Promise.all(
                    this.addresses.map((a) =>
                        updateDoc(addressDocRef(userId, a.id), { isPrimary: a.id === id })
                    )
                )
                this.addresses.forEach((a) => (a.isPrimary = a.id === id))
            } catch (e) {
                this.error = 'ไม่สามารถตั้งค่าที่อยู่หลักได้'
            } finally {
                this.loading = false
            }
        },
    },
})

import { defineStore } from 'pinia'
import {
    collection, addDoc, getDocs, updateDoc, doc, serverTimestamp, query, orderBy, where,
} from 'firebase/firestore'
import { db } from '../firebase'

function emptyProduct() {
    return { refProduct: null, description: '', quantity: '' }
}

export const useQuotationStore = defineStore('quotation', {
    state: () => ({
        // ---- customer form ----
        company: { name: '', contact: '', phone: '', email: '' },
        products: [emptyProduct()],
        note: '',
        selectingIndex: null,   // index of the product slot awaiting reference selection
        submitting: false,
        error: null,
        submitted: false,
        submittedId: null,

        // ---- admin list ----
        quotations: [],
        loadingList: false,
        listError: null,

        // ---- customer list ----
        userQuotations: [],
        loadingUser: false,
        userError: null,
    }),

    getters: {
        isFormValid(state) {
            const c = state.company
            if (!c.name.trim() || !c.contact.trim() || !c.phone.trim() || !c.email.trim()) return false
            if (state.products.length === 0) return false
            return state.products.every((p) => p.description.trim() && Number(p.quantity) > 0)
        },
    },

    actions: {
        // --- product list management ---
        addProduct() {
            if (this.products.length >= 10) return
            this.products.push(emptyProduct())
        },
        removeProduct(index) {
            this.products.splice(index, 1)
            if (this.products.length === 0) this.products.push(emptyProduct())
        },

        // --- reference product selection ---
        startSelectingRef(index) {
            this.selectingIndex = index
        },
        setProductRef(product) {
            if (this.selectingIndex === null) return
            this.products[this.selectingIndex].refProduct = {
                id:          product.id,
                title:       product.title,
                imageUrl:    product.imageUrl || product.coverImageUrl || null,
                variantLabel: product.variantLabel || null,
            }
            this.selectingIndex = null
        },
        clearProductRef(index) {
            this.products[index].refProduct = null
        },

        // --- submit ---
        async submitQuotation(userId = null) {
            this.submitting = true
            this.error = null
            try {
                const ref = await addDoc(collection(db, 'quotations'), {
                    userId:    userId ?? null,
                    company: { ...this.company },
                    products: this.products.map((p) => ({
                        refProductId:           p.refProduct?.id           ?? null,
                        refProductName:         p.refProduct?.title        ?? null,
                        refProductImageUrl:     p.refProduct?.imageUrl     ?? null,
                        refProductVariantLabel: p.refProduct?.variantLabel ?? null,
                        description:        p.description.trim(),
                        quantity:           Number(p.quantity),
                    })),
                    note:      this.note.trim(),
                    status:    'pending',
                    createdAt: serverTimestamp(),
                })
                this.submittedId = ref.id
                this.submitted = true
            } catch (e) {
                this.error = 'ไม่สามารถส่งใบเสนอราคาได้ กรุณาลองใหม่อีกครั้ง'
                throw e
            } finally {
                this.submitting = false
            }
        },

        reset() {
            this.company      = { name: '', contact: '', phone: '', email: '' }
            this.products     = [emptyProduct()]
            this.note         = ''
            this.selectingIndex = null
            this.submitting   = false
            this.error        = null
            this.submitted    = false
            this.submittedId  = null
        },

        // --- customer ---
        async fetchUserQuotations(userId) {
            this.loadingUser = true
            this.userError = null
            try {
                const snap = await getDocs(
                    query(collection(db, 'quotations'), where('userId', '==', userId))
                )
                this.userQuotations = snap.docs
                    .map((d) => ({ id: d.id, ...d.data() }))
                    .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
            } catch (e) {
                this.userError = 'ไม่สามารถโหลดข้อมูลได้'
            } finally {
                this.loadingUser = false
            }
        },

        async updateQuotationStatus(id, status) {
            try {
                await updateDoc(doc(db, 'quotations', id), { status })
                const q = this.quotations.find((q) => q.id === id)
                if (q) q.status = status
                const uq = this.userQuotations.find((q) => q.id === id)
                if (uq) uq.status = status
            } catch (e) {
                this.listError = 'Failed to update status.'
            }
        },

        // --- admin ---
        async fetchQuotations() {
            this.loadingList = true
            this.listError = null
            try {
                const snap = await getDocs(
                    query(collection(db, 'quotations'), orderBy('createdAt', 'desc'))
                )
                this.quotations = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
            } catch (e) {
                this.listError = 'ไม่สามารถโหลดข้อมูลได้'
            } finally {
                this.loadingList = false
            }
        },
    },
})

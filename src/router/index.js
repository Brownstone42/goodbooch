import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductView from '../views/ProductView.vue'
import CartView from '../views/CartView.vue'
import CheckoutView from '../views/CheckoutView.vue'
import LoginView from '../views/LoginView.vue'
import ProfileView from '../views/ProfileView.vue'
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import AdminOrders from '../views/admin/AdminOrders.vue'
import AdminQuotations from '../views/admin/AdminQuotations.vue'
import PurchaseHistoryView from '../views/PurchaseHistoryView.vue'
import OrderDetailView from '../views/OrderDetailView.vue'
import CategoriesView from '../views/CategoriesView.vue'
import QuoteView from '../views/QuoteView.vue'
import AddressListView from '../views/AddressListView.vue'
import AddressFormView from '../views/AddressFormView.vue'
import ProfileUserView from '../views/ProfileUserView.vue'
import ProfilePaymentView from '../views/ProfilePaymentView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', component: HomeView },
        { path: '/product/:id', component: ProductView },
        { path: '/cart', component: CartView },
        { path: '/checkout', component: CheckoutView },
        { path: '/login', redirect: '/profile' },
        { path: '/profile', component: ProfileView },
        { path: '/admin', component: AdminDashboard },
        { path: '/admin/orders', component: AdminOrders },
        { path: '/admin/quotations', component: AdminQuotations },
        { path: '/purchase-history', component: PurchaseHistoryView },
        { path: '/purchase-history/:id', component: OrderDetailView },
        { path: '/categories', component: CategoriesView },
        { path: '/quote', component: QuoteView },
        { path: '/profile/user', component: ProfileUserView },
        { path: '/profile/payment', component: ProfilePaymentView },
        { path: '/profile/address', component: AddressListView },
        { path: '/profile/address/new', component: AddressFormView },
        { path: '/profile/address/:addressId/edit', component: AddressFormView },
    ],
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductView from '../views/ProductView.vue'
import CartView from '../views/CartView.vue'
import CheckoutView from '../views/CheckoutView.vue'
import LoginView from '../views/LoginView.vue'
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import AdminOrders from '../views/admin/AdminOrders.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', component: HomeView },
        { path: '/product/:id', component: ProductView },
        { path: '/cart', component: CartView },
        { path: '/checkout', component: CheckoutView },
        { path: '/login', component: LoginView },
        { path: '/admin', component: AdminDashboard },
        { path: '/admin/orders', component: AdminOrders },
    ],
})

export default router

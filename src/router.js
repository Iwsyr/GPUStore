import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './components/Home/Home.vue'
import ProductShop from './components/Shop/Shop.vue'
import ShoppingCart from './components/Cart/RtIndex.vue'
import UserProfile from './components/my/RtIndex.vue'
import NewsDetail from '@/components/News/RtDisplay.vue'
import { useAuthStore } from '@/store/authStore'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('./views/Login.vue'),
    meta: { noAuth: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('./views/Register.vue'),
    meta: { noAuth: true }
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('./views/Admin.vue'),
    meta: { showTabBar: false, requiresAdmin: true }
  },
  { path: '/', redirect: '/login' },
  {
    path: '/home',
    name: 'home',
    component: HomePage,
    meta: { showTabBar: true }
  },
  { path: '/shop', component: ProductShop, meta: { showTabBar: true } },
  { path: '/cart', component: ShoppingCart, meta: { showTabBar: true } },
  { path: '/my', component: UserProfile, meta: { showTabBar: true } },
  {
    path: '/news',
    component: () => import('@/components/News/components/RtAction.vue'),
    meta: { showTabBar: true }
  },
  {
    path: '/disp',
    component: NewsDetail,
    meta: { showTabBar: false }
  },
  {
    path: '/product',
    name: 'product',
    meta: { showTabBar: false },
    component: () => import('@/components/productinfo/productinfo.vue')
  },
  { path: '/:pathMatch(.*)*', component: () => import('./error/ErrorPage.vue') },
  {
    path: '/pay',
    name: 'pay',
    component: () => import('@/components/pay/RtIndex.vue')
  },
  {
    path: '/orderlist',
    name: 'OrderList',
    component: () => import('@/components/my/components/RtOrderList.vue'),
    meta: { showTabBar: false }
  },
  {
    path: '/collect',
    name: 'Collect',
    component: () => import('@/components/my/components/RtCollectList.vue'),
    meta: { showTabBar: false }
  },
  {
    path: '/addresslist',
    name: 'addresslist',
    component: () => import('@/components/my/address/RtList.vue'),
    meta: { showTabBar: false }
  },
  {
    path: '/addressedit',
    name: 'addressedit',
    component: () => import('@/components/my/address/RtEdit.vue'),
    meta: { showTabBar: false }
  },
  {
    path: '/paysuccess',
    name: 'paysuccess',
    component: () => import('@/components/pay/components/RtPaySuccess.vue'),
    meta: { showTabBar: false }
  },
  {
    path: '/review',
    name: 'Review',
    component: () => import('@/components/review/RtIndex.vue'),
    meta: { showTabBar: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const authStore = useAuthStore();

  if (!to.meta.noAuth && !token) {
    next({ path: '/login', query: { redirect: to.fullPath } });
    return;
  }

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next({ path: '/home' });
    return;
  }

  next();
});

export default router

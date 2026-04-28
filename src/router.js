import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './components/Home/Home.vue'
import ProductShop from './components/Shop/Shop.vue'
import ShoppingCart from './components/Cart/RtIndex.vue'
import UserProfile from './components/my/RtIndex.vue'
import NewsDetail from '@/components/News/RtDisplay.vue'

const routes = [
  { path: '/', redirect: '/home' },
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
    meta: {
      showTabBar: true
    }
  },
  {
    path: '/disp',
    component: NewsDetail,
    meta: {
      showTabBar: false
    }
  },
  {
    path: '/product',
    name: 'product',
    meta: {
        showTabBar: false
    },
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
  meta: {
    showTabBar: false
  }
},
{
  path: '/collect',
  name: 'Collect',
  component: () => import('@/components/my/components/RtCollectList.vue'),
  meta: {
    showTabBar: false
  }
},
{
  path: '/addresslist',
  name: 'addresslist',
  component: () => import('@/components/my/address/RtList.vue'),
  meta: {
    showTabBar: false
  }
},
{
  path: '/addressedit',
  name: 'addressedit',
  component: () => import('@/components/my/address/RtEdit.vue'),
  meta: {
    showTabBar: false
  }
},
{
  path: '/paysuccess',
  name: 'paysuccess',
  component: () => import('@/components/pay/components/RtPaySuccess.vue'),
  meta: {
    showTabBar: false
  }
}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

<template>
  <div class="profile">
    <!-- 用户信息 -->
    <RtInfo />
    <div style="padding: 10px; text-align: center;">
     <van-button size="small" plain @click="onLogout">退出登录</van-button>
    </div>
    <!-- 订单状态 -->
    <!-- 修改订单状态部分 -->
    <RtOrder @click="$router.push('/orderlist')" />
    
    <!-- 功能列表 -->
    <div class="function-list">
      <div class="function-item" @click="$router.push('/collect')">
        <div class="text">我的收藏</div>
        <div class="arrow">></div>
      </div>
      <div class="function-item" @click="$router.push('/addresslist')">
        <div class="text">收货地址</div>
        <div class="arrow">></div>
      </div>
      <div class="function-item">
        <div class="text">客服中心</div>
        <div class="arrow">></div>
      </div>
      <div class="function-item">
        <div class="text">设置</div>
        <div class="arrow">></div>
      </div>
      <div class="function-item" v-if="isAdmin" @click="$router.push('/admin')">
        <div class="text">管理中心</div>
        <div class="arrow">></div>
      </div>
    </div>
  </div>
</template>

<script>
import RtInfo from './components/RtInfo.vue'
import RtOrder from './components/RtOrder.vue'
import { mapState } from 'pinia'
import { shopStore } from '@/store/shopStore'
import { useAuthStore } from '@/store/authStore';

export default {
  name: 'UserProfile',
  components: {
    RtInfo,
    RtOrder
  },
  computed: {
  ...mapState(shopStore, ['userInfo']),
  isAdmin() {
    return useAuthStore().isAdmin;
    }
  },
  methods: {
  onLogout() {
    const authStore = useAuthStore();
    authStore.logout();
    const shop = shopStore();
    shop.carts = [];
    shop.orders = [];
    shop.collects = [];
    shop.likes = [];
    shop.addressInfo = [];
    shop.collectLoaded = false;
    shop.likesLoaded = false;
    shop.ordersLoaded = false;
    shop.addressLoaded = false;
    shop.edit_userInfo_act({
      name: '冰可乐商城',
      desc: shop.userInfo.desc
    });
    this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.profile {
  padding-bottom: 50px;
}
.user-info {
  height: 150px;
  background: #FF0036;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #fff;
  margin-bottom: 10px;
}
.order-status {
  display: flex;
  background: #fff;
  padding: 15px 0;
  margin-bottom: 10px;
}
.status-item {
  flex: 1;
  text-align: center;
  font-size: 12px;
}
.status-item .icon {
  margin-bottom: 5px;
}
.function-list {
  background: #fff;
}
.function-item {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  border-bottom: 1px solid #eee;
}
.function-item .arrow {
  color: #999;
}
</style>

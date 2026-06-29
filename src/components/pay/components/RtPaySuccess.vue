<template>
  <div class="success">
    <van-icon name="checked" />
    <h3>支付成功</h3>
    <p v-if="!delivered">
      您的商品正在发货中，预计 <span class="countdown">{{ countdown }}秒</span> 后送达
    </p>
    <p v-else>
      商品已送达！请前往
      <router-link :to="{ path: '/orderlist', query: { active: 3 } }">待评价</router-link>
      进行评价
    </p>
    <p class="links">
      <router-link to="/orderlist">查看订单</router-link>
      &nbsp;|&nbsp;
      <router-link to="/home">返回首页</router-link>
    </p>
  </div>
</template>

<script>
import { orderAPI } from '@/services/api';
import { showToast } from 'vant';

export default {
  name: "PaySuccess",
  data() {
    return {
      orderId: null,
      countdown: 30,
      delivered: false,
      timer: null
    }
  },
  async mounted() {
    this.orderId = this.$route.query.orderId || null;
    if (this.orderId) {
      this.startDeliveryTimer();
    }
  },
  beforeUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    startDeliveryTimer() {
      this.timer = setInterval(async () => {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(this.timer);
          this.timer = null;
          await this.autoDeliver();
        }
      }, 1000);
    },
    async autoDeliver() {
      if (!this.orderId) return;
      try {
        await orderAPI.updateOrderStatus(this.orderId, 'delivered');
        this.delivered = true;
        showToast('商品已送达');
      } catch (error) {
        console.error('自动流转订单状态失败:', error);
      }
    }
  }
}
</script>

<style scoped>
.success {
  width: 90%;
  margin: auto;
  text-align: center;
  padding-top: 20%;
}
.success h3 {
  font-size: 18px;
  margin-top: 16px;
  margin-bottom: 10px;
}
.success .van-icon {
  font-size: 70px;
  color: #52b838;
}
.success p {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
}
.countdown {
  color: #ee0a24;
  font-weight: bold;
  font-size: 16px;
}
.links {
  margin-top: 20px;
}
.links a {
  color: #1574e3;
}
</style>

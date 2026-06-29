<template>
  <!-- 评价成功页 -->
  <div v-if="submitted" class="success">
    <van-icon name="checked" />
    <h3>评价成功</h3>
    <p>感谢您的评价！</p>
    <p class="links">
      <router-link to="/orderlist?active=3">返回订单列表</router-link>
    </p>
  </div>

  <!-- 评价表单 -->
  <div v-else class="review-page">
    <van-nav-bar title="商品评价" left-text="返回" left-arrow @click-left="$router.back()" />

    <div v-for="(item, index) in orderItems" :key="item.id || index" class="review-card">
      <van-cell :title="item.product_name" :label="'¥' + item.price">
        <template #icon>
          <img :src="item.image_url" class="product-img" />
        </template>
      </van-cell>

      <div class="rating-row">
        <span>商品评分</span>
        <van-rate v-model="reviews[index].rating" />
      </div>

      <van-field
        v-model="reviews[index].content"
        rows="3"
        autosize
        label="评价内容"
        type="textarea"
        maxlength="200"
        placeholder="请输入评价内容"
        show-word-limit
      />
    </div>

    <div class="submit-bar">
      <van-button type="primary" round block @click="onSubmit">提交评价</van-button>
    </div>
  </div>
</template>

<script>
import { orderAPI } from '@/services/api';
import { showToast } from 'vant';

export default {
  data() {
    return {
      orderId: null,
      orderItems: [],
      reviews: [],
      submitted: false
    };
  },
  async mounted() {
    this.orderId = this.$route.query.orderId;
    if (!this.orderId) {
      showToast('订单ID不存在');
      this.$router.back();
      return;
    }
    try {
      const order = await orderAPI.getOrder(this.orderId);
      this.orderItems = order.items || [];
      this.reviews = this.orderItems.map(item => ({
        product_id: item.product_id,
        rating: 5,
        content: '',
        images: []
      }));
    } catch (err) {
      showToast('获取订单失败');
    }
  },
  methods: {
    async onSubmit() {
      for (const r of this.reviews) {
        if (!r.rating) {
          showToast('请为所有商品评分');
          return;
        }
      }
      try {
        // 调用后端将订单状态从 delivered 更新为 completed
        await orderAPI.updateOrderStatus(parseInt(this.orderId), 'completed');
        // 显示成功页面
        this.submitted = true;
      } catch (err) {
        showToast(err.response?.data?.message || '提交评价失败');
      }
    }
  }
};
</script>

<style scoped>
.review-page {
  background: #f5f5f5;
  min-height: 100vh;
}
.review-card {
  background: #fff;
  margin: 10px;
  border-radius: 8px;
  padding: 10px;
}
.product-img {
  width: 60px;
  height: 60px;
  margin-right: 10px;
  border-radius: 4px;
  object-fit: cover;
}
.rating-row {
  display: flex;
  align-items: center;
  padding: 10px;
  gap: 10px;
}
.submit-bar {
  padding: 20px;
}
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
.links {
  margin-top: 20px;
}
.links a {
  color: #1989fa;
  text-decoration: none;
  font-size: 14px;
}
</style>

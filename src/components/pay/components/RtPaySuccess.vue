<template>
  <div class="success">
    <van-icon name="checked" />
    <h3>支付成功</h3>
    <p>已收到您的订单,请留意
      <router-link to="/orderlist">订单详情</router-link>
      以及
      <router-link to="/">返回首页</router-link>
      另外祝您生活愉快 感谢您的支持与厚爱
    </p>
  </div>
</template>

<script>
export default {
  name: "PaySuccess"
}
</script>

<style scoped>
.success {
  width: 90%;
  margin: auto;
  text-align: center;
}

.success h3 {
  font-size: 18px;
  margin-top: 16px;
  margin-bottom: 10px;
}

.success i {
  display: block;
  padding-top: 30%;
  font-size: 70px;
  color: #52b838;
}

.success p {
  width: 92%;
  font-size: 13px;
  margin: auto;
}

.success p a {
  color: #1574e3;
}
</style>



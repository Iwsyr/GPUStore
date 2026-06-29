<template>
   <van-grid>
     <van-cell title="我的订单" />
     <van-grid-item
       v-for="item in orderInfo"
       :key="item.key"
       :to="item.to"
       :text="item.text"
       :icon="item.icon"
     />
   </van-grid>
</template>

<script>
export default {
   data() {
     return {
       orderInfo: [
         { text: "全部订单", icon: "pending-payment", to: "/my" },
         { text: "待付款", icon: "balance-o", to: "/my" },
         { text: "待收货", icon: "paid", to: "/my" },
         { text: "待评价", icon: "flower-o", to: "/my" }
       ]
     };
   }
};
</script>

<style scoped>
/* 这里可以添加样式代码 */
</style>
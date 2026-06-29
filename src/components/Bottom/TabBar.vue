<template>
  <van-tabbar v-model="active" v-show="blnShow">
      <van-tabbar-item replace to="/home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item replace to="/shop" icon="bag-o">商城</van-tabbar-item>
      <van-tabbar-item replace to="/news" icon="newspaper-o">动态</van-tabbar-item>
      <van-tabbar-item replace to="/cart" icon="cart-o">购物车</van-tabbar-item>
      <van-tabbar-item replace to="/my" icon="user-o">我的</van-tabbar-item>
  </van-tabbar>
</template>
<script>
export default {
  props: ["blnShow"],
  computed: {
    active: {
      get() {
        const routeMap = { '/': 0, '/home': 0, '/shop': 1, '/news': 2, '/cart': 3, '/my': 4 };
        return routeMap[this.$route.path] ?? 0;
      },
      set() {
      }
    }
  }
}
</script>
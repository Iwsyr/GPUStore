<template>
  <van-grid :column-num="3" :border="false">
    <van-grid-item
      v-for="(item, key) in items"
      class="prod-item"
      :key="key"
      @click="enter(item.id)"
    >
      <van-image :src="item.src" />
      <p>{{ item.name }}</p>
      <p class="mfont">￥{{ item.price }}</p>
      <p v-if="item.stock !== undefined && item.stock <= 0" class="out-of-stock-tag">缺货</p>
    </van-grid-item>
  </van-grid>
</template>
<script>
export default {
  props: ["items"],
  methods: {
    enter(id) {
      this.$router.push({
        path: '/product',
        query: { id: id }
      })
    }
  }
};
</script>
<style scoped>
.prod-item p {
  font-size: 13px;
  color: #151313;
  margin-top: 5px;
}
.mfont {
  font-size: 16px;
  color: #f2270c !important;
  font-weight: bold;
}
.out-of-stock-tag {
  font-size: 12px;
  color: #fff;
  background: #ee0a24;
  border-radius: 4px;
  padding: 0 6px;
  margin-top: 2px;
}
</style>
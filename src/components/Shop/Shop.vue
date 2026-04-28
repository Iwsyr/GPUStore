<template>
  <van-nav-bar class="title" title="欢迎来到冰可乐显卡商城" />
  <Search @onInputSearch="onInputSearch" />
  <div class="cate">
    <div class="cate-left">
    <CateLeft :items="leftItems" @onChange="onChange" />
    </div>
    <div class="cate-right">
    <CateRight :items="curItems" />
    </div>
  </div>
</template>
   
<script> 
import data from "@/components/Shop/shop.js"
import Search from "./components/Search.vue";
import CateLeft from "./components/CateLeft.vue";
import CateRight from "./components/CateRight.vue";
export default {
  name: 'RtShop',
  data() {
    return {
      leftItems: data.leftItems,
      rightItems: data.rightItems,
      curItems: [],
      searchkey:""
    }
  },
  components: {
    Search,
    CateLeft,
    CateRight
  },
  methods: {
    onInputSearch(key){
         this.curItems = this.rightItems.filter(item=>item.name.includes(key))
    },
    onChange(idx) {
      this.curItems = [];
      if (idx) {
        this.curItems = this.rightItems.filter(item => item.cid == idx);
      } else {
        this.curItems = this.rightItems;
      }
    }
  },
  mounted() {
    this.curItems = this.rightItems;
  }
}
</script>
   
<style scoped>
.title {
  background: linear-gradient(90deg, #4A1414, #8B4513, #EDEDED);
}

.title >>> .van-nav-bar__title {
  font-size: 18px; /* 字体大小 */
  font-weight: bold; /* 字体粗细 */
  color: #ffffff; /* 字体颜色 */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5); /* 文字阴影 */
  letter-spacing: 1px; /* 字间距 */
}

.cate {
  display: flex;
  justify-content: space-between;
}

.cate-left {
  width: 120px;
}

.cate-right {
  width: 100%;
  padding-bottom: 30px;
}
</style>
   
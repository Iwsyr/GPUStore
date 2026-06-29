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
import { showToast } from 'vant';

export default {
  name: 'RtShop',
  data() {
    return {
      leftItems: [],
      rightItems: [],
      curItems: [],
      searchkey: "",
      loading: false
    }
  },
  components: {
    Search,
    CateLeft,
    CateRight
  },
  methods: {
    onInputSearch(key){
         this.curItems = this.rightItems.filter(item => item.name && item.name.includes(key))
    },
    onChange(idx) {
      this.curItems = [];
      if (idx > 0) {
        const categoryId = this.leftItems[idx].id;
        this.curItems = this.rightItems.filter(item => item.cid == categoryId);
      } else {
        this.curItems = this.rightItems;
      }
    },
    async loadProducts() {
      this.loading = true;
      try {
        const products = await data.fetchProducts();
        this.rightItems = products.map(product => ({
          id: product.id,
          cid: product.category_id,
          name: product.name,
          price: product.price,
          src: product.src
        }));
        this.curItems = this.rightItems;
      } catch (error) {
        console.error('加载产品失败:', error);
        showToast('加载产品失败，请稍后重试');
      } finally {
        this.loading = false;
      }
    },
    async loadCategories() {
      try {
        this.leftItems = await data.fetchCategories();
      } catch (error) {
        console.error('加载分类失败:', error);
        this.leftItems = [
          { id: '0', name: '全部分类' },
          { id: '1', name: '50系列' },
          { id: '2', name: '40系列' },
          { id: '3', name: '30系列' },
          { id: '4', name: '显卡配件' }
        ];
      }
    }
  },
  async mounted() {
    await this.loadCategories();
    await this.loadProducts();
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
   
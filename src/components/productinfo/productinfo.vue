<template>
    <van-nav-bar title="产品详细" left-text="返回" left-arrow @click-left="onClickLeft" />
    <div v-if="product">
      <Swipe :product="product" />
      <Info :product="product" />
      <Tabs :product="product" />
      <Action :product="product" />
    </div>
    <div v-else class="loading-tip">加载中，请稍候...</div>
</template>
<script>
import data from '@/components/Shop/shop.js';
import Swipe from './components/PSwipe.vue';
import Info from './components/PInfo.vue';
import Tabs from './components/PTabs.vue';
import Action from './components/PAction.vue';
import { showToast } from 'vant';
export default {
    name: 'ProductInfo',
    data() {
        return {
            id: parseInt(this.$route.query.id),
            product: null,
            loading: false
        }
    },
    components: {
        Swipe,
        Info,
        Tabs,
        Action
    },
    async mounted() {
        await this.loadProduct();
    },
    methods: {
        async loadProduct() {
            this.loading = true;
            try {
                this.product = await data.fetchProductDetail(this.id);
            } catch (error) {
                console.error('加载商品详情失败:', error);
                showToast('加载商品详情失败，请稍后重试');
            } finally {
                this.loading = false;
            }
        },
        onClickLeft() {
            this.$router.push('/shop');
        }
    }
}
</script>
<style scoped></style>
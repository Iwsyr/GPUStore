<template>
    <van-action-bar>
        <van-action-bar-icon color="red" @click="toggleCollect" :icon="retBlnCollected ? 'like' : 'like-o'"
            :text="retBlnCollected ? '已收藏' : '收藏'" />
        <van-action-bar-icon icon="cart-o" text="购物车" :badge="cartCount" @click="enter" />
        <van-action-bar-button type="warning" text="加入购物车" @click="addCarts" />
        <van-action-bar-button type="danger" text="立即购买" @click="goAddCarts"/>
    </van-action-bar>
</template>
<script>
import { mapState, mapActions } from 'pinia'
import { shopStore } from '@/store/shopStore'
import { orderAPI } from '@/services/api'
import { showToast } from 'vant'
export default {
    name: 'ProductAction',
    props: ['product'],
    async mounted() {
        const shop = shopStore();
        if (!shop.collectLoaded) {
            await shop.fetchCollects();
        }
    },
    methods: {
        ...mapActions(shopStore, ['add_collect_act', 'del_collect_act', 'add_carts_act']),
        async toggleCollect() {
            if (this.retBlnCollected) {
                await this.del_collect_act(this.product.id);
            } else {
                await this.add_collect_act({ id: this.product.id, type: 1 });
            }
        },
        enter() {
            this.$router.push('/cart');
        },
        async addCarts() {
            if (!this.product) {
                return;
            }
            if (this.product.stock !== undefined && this.product.stock <= 0) {
                showToast('该商品暂时缺货');
                return;
            }
            const _prod = {
                id: this.product.id,
                product_id: this.product.id,
                title: this.product.title || this.product.name,
                num: 1,
                price: this.product.price,
                img: (this.product.swiper && this.product.swiper[0] && this.product.swiper[0].src) || this.product.src || ''
            };
            try {
                await this.add_carts_act(_prod);
                this.$emit('cartUpdated');
            } catch (err) {
                const msg = err.response?.data?.message || '添加购物车失败';
                showToast(msg);
            }
        },
        async goAddCarts() {
            if (!this.product) return;
            if (this.product.stock !== undefined && this.product.stock <= 0) {
                showToast('该商品暂时缺货');
                return;
            }

            // 1. 调用后端创建待付款订单
            try {
                const order = await orderAPI.createOrder({
                    items: [{
                        product_id: this.product.id,
                        quantity: 1
                    }]
                });
                // 2. 创建成功后跳转到结算中心，携带订单 ID
                this.$router.push({ path: '/pay', query: { orderId: order.id } });
            } catch (error) {
                const msg = error.response?.data?.message || '创建订单失败，请稍后重试';
                showToast(msg);
            }
        }
    },
    computed: {
        ...mapState(shopStore, ['collects', 'carts']),
        cartCount() {
            return this.carts.length;
        },
        retBlnCollected() {
            return this.product && this.collects.some(item => item.id == this.product.id && item.type == 1);
        }
    }
}
</script>
<style scoped></style>
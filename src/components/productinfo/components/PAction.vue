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
import { shopStore } from "@/store/shopStore"
import data from "@/components/Shop/shop.js"
import { getProdById } from "@/utils/prod";
export default {
    name: "ProductAction",
    props: ["id"],
    methods: {
        ...mapActions(shopStore, ["add_collect_act", "del_collect_act", "add_carts_act"]),
        toggleCollect() {
            if(this.retBlnCollected) {
                this.del_collect_act(this.id);
            } else {
                this.add_collect_act({ 'id': this.id, 'type': 1 });
            }
        },
        enter() {
            this.$router.push('/cart')
        },
        addCarts() {
            let prod = getProdById(data.prods, this.id);
            let _prod = {
                id: prod.id,
                title: prod.title,
                num: 1,
                price: prod.price,
                img: prod.swiper[0].src
            }
            this.add_carts_act(_prod).then(() => {
                // 强制更新组件
                this.$forceUpdate();
                // 触发购物车更新事件
                this.$emit('cartUpdated');
                // 使用nextTick确保DOM更新
                this.$nextTick(() => {
                    // 可以添加额外的更新逻辑
                });
            }).catch(err => {
                console.error('添加购物车失败:', err);
            });
        },
        goAddCarts() {
            // 检查商品是否已在购物车
            const isInCart = this.carts.some(item => item.id === this.id);
            if (!isInCart) {
                this.addCarts();
            }
            this.enter();
        }
    },
    computed: {
        ...mapState(shopStore, ["collects", "carts"]),
        // 添加购物车数量计算属性
        cartCount() {
            return this.carts.length;
        },
        retBlnCollected() {
            return this.collects.filter(item => item.id == this.id && item.type == 1).length > 0 ? true : false;
        }
    }
}
</script>
<style scoped></style>
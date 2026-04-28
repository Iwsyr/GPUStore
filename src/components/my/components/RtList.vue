<template>
    <van-cell v-for="item, key in listInfo" 
        :key="key" 
        :title="item.title" 
        :icon="item.icon" 
        :url="item.url" is-link />
</template>
<script>
export default {
    data() {
        return {
            listInfo: [
                { title: "我的收藏", icon: "like-o", url: "#/collect" },
                { title: "收货地址", icon: "logistics", url: "#/addresslist" },
                { title: "购物车", icon: "shopping-cart-o", url: "#/cart" }
            ]
        }
    }
}
</script>
<style scoped></style>
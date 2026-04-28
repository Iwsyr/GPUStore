<template>
    <van-swipe class="rt-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="item, key in swiper" :key="key">
            <a :href="item.url"><van-image fit="fill" :src="item.src" /></a>
        </van-swipe-item>
    </van-swipe>
</template>
<script>
import data from "@/components/Shop/shop.js"
import { getProdById } from "@/utils/prod";
export default {
    name: "ProductSwipe",
    props: ["id"],
    data() {
        return {
            swiper: getProdById(data.prods, this.id).swiper
        }
    }
}
</script>
<style scoped>
.rt-swipe {
    height: 330px;
    margin-top: -5px;
}

.rt-swipe .van-swipe-item {
    color: #fff;
    font-size: 20px;
    text-align: center;
}
</style>
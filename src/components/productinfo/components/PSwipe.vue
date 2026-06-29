<template>
    <van-swipe class="rt-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="item, key in swiper" :key="key">
            <a :href="item.url"><van-image fit="fill" :src="item.src" /></a>
        </van-swipe-item>
    </van-swipe>
</template>
<script>
export default {
    name: 'ProductSwipe',
    props: ['product'],
    computed: {
        swiper() {
            return (this.product && this.product.swiper) || [];
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
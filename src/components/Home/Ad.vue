<template>
    <van-row>
        <van-col :span="24" class="ad-title">
            <h3>{{ ad.title }}</h3>
        </van-col>
    </van-row>
    <van-row>
        <van-col :span="24" class="ad-url">
            <img :src="ad.url"/>
        </van-col>
    </van-row>
</template>

<script>
import ad0 from "@/assets/Cate/40.jpg"

export default {
    name:'HomeAd',
    data() {
        return {
            ad: {
                title: "爆款系列",
                url: ad0
            }
        }
    }
}
</script>

<style scoped>
    .ad-title {
        margin: 10px 0;
        padding: 0 15px;
        font-size: 15px;
    }
    .ad-url img {
        width: 100%;
    }
</style>

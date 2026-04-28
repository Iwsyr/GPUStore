<template>
    <van-tabs style="padding-bottom: 30px;" v-model:active="active">
        <van-tab title="图文详情">
            <div class="item" v-for="item, key in imgs" :key="key">
                <van-image fit="fill" :src="item" />
            </div>
        </van-tab>
        <van-tab title="商品详情">
            <div class="detail" v-html="detail"></div>
        </van-tab>
    </van-tabs>
</template>
<script>
import data from "@/components/Shop/shop.js"
import { getProdById } from "@/utils/prod";
export default {
    name: "ProductTabs",
    props: ["id"],
    data() {
        return {
            active: 0,
            imgs: getProdById(data.prods, this.id).imgs,
            detail: getProdById(data.prods, this.id).detail
        }
    }
}
</script>
<style>
.detail {
    padding: 15px 20px;
    color: #515151;
    margin-bottom: 50px;
}

.detail h3 {
    padding: 10px 0;
    border-bottom: solid 1px #ccc;
    margin-bottom: 10px;
}
</style>
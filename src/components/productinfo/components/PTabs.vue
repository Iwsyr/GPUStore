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
export default {
    name: 'ProductTabs',
    props: ['product'],
    data() {
        return {
            active: 0
        }
    },
    computed: {
        imgs() {
            return (this.product && this.product.imgs) || [];
        },
        detail() {
            return (this.product && this.product.detail) || '';
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
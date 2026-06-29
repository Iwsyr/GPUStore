<template>
    <div class="p-info">
        <h3>{{ info.title }}</h3>
        <p class="p-title"><van-tag plain type="danger">{{ info.bright }} </van-tag>
           </p>
        <p>
            <van-tag round color="#7232dd">{{ info.bright2 }} </van-tag>
             <van-tag round color="#7232dd">{{ info.bright3 }} </van-tag>
        </p>
        <p class="p-price">￥{{ info.price }}</p>
        <p class="p-stock" v-if="info.stock !== undefined">
            <span v-if="info.stock > 0">库存: {{ info.stock }} 件</span>
            <span v-else class="out-of-stock">暂时缺货</span>
        </p>
    </div>
    <div class="p-tip">
        <van-cell icon="passed" is-link title="支持微信先用后付" @click="show = true" />
        <van-action-sheet v-model:show="show" title="服务说明">
            <div class="p-content">
                <h3><van-icon name="passed" />支持花呗分期</h3>
                <p>本商品支持花呗分期，无手续费用</p>
                <h3><van-icon name="passed" />支持先用后付</h3>
                <p>本商品微信先用后付，无手续费</p>
            </div>
        </van-action-sheet>
    </div>
</template>
<script>
export default {
    name: 'ProductInfo',
    props: ['product'],
    data() {
        return {
            show: false
        }
    },
    computed: {
        info() {
            return this.product || {};
        }
    }
}
</script>
<style scoped>
.p-info,
.p-tip {
    padding: 10px 15px;
    color: #000000;
    border-bottom: solid 1px #cccc;
}

.van-cell,
.p-tip {
    background-color:#7ae76b;
}

.p-info .p-title {
    margin: 5px 0;
    font-size: 15px;
    line-height: 25px;
}

.p-info .p-price {
    font-size: 26px;
    color: rgb(255, 70, 38);
    margin-left: -6px;
}

.p-info .p-stock {
    font-size: 14px;
    color: #666;
    margin-top: 4px;
}

.p-info .p-stock .out-of-stock {
    color: #ee0a24;
    font-weight: 500;
}

.p-content {
    color: #8a875e;
    padding: 10px 30px;
    line-height: 32px;
    margin-bottom: 30px;
}

.p-content p {
    margin-left: 18px;
    margin-bottom: 10px;
    color: #000000;
}
</style>
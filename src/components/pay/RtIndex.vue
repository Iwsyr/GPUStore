<template>
    <van-nav-bar title="结算中心" left-text="返回" left-arrow @click-left="onClickLeft" />
    <div class="address">
        <div class="addr-title">
            <span>{{ addressInfo[0].name }}</span>
            <span>{{ addressInfo[0].tel }}</span>
        </div>
        <div class="addr-info">{{ addressInfo[0].address }}</div>
    </div>
    <div class="pay-item">
        <div class="title">商品清单</div>
        <van-card v-for="item, key in payProd" :key="key" :num="item.num" :price="item.price" desc="描述信息"
            :title="item.title" :thumb="item.img" />
    </div>
    <div class="pay-item">
        <div class="title">订单留言</div>
        <van-cell-group inset>
            <van-field v-model="message" style="margin-top:10px;border:solid 1px #eee" rows="3" autosize type="textarea"
                maxlength="50" placeholder="请输入留言" show-word-limit />
        </van-cell-group>
    </div>
    <van-submit-bar :price="sumPrice * 100" button-text="立即结算" @submit="onSubmit">
    </van-submit-bar>
</template>
<script>
import { mapState, mapActions } from 'pinia'
import { shopStore } from "@/store/shopStore"
export default {
    data() {
        return {
            message: "",
            sumPrice: 0
        }
    },
    mounted() {
        this.countSumPrice();
    },
    computed: {
        ...mapState(shopStore, ["carts", "addressInfo"]),
        payProd() {
            return this.carts.filter(item => item.checked == true)
        }
    },
    methods: {
        ...mapActions(shopStore, ["add_orders_act"]),
        onClickLeft() {
            history.back();
        },
        countSumPrice() {
            let _sumPrice = 0;
            this.carts.forEach(item => {
                if (item.checked) {
                    _sumPrice += item.num * item.price;
                }
            })
            this.sumPrice = _sumPrice;
        },
        onSubmit() {
            let _orderInfo = {
                prods: this.payProd,
                mess: this.message,
                sumPrice: this.sumPrice,
                address: {
                    name:this.addressInfo[0].name,
                    tel:this.addressInfo[0].tel,
                    address:this.addressInfo[0].address
                }
            }
            this.add_orders_act(_orderInfo);
            // 删除已结算商品
            this.carts.forEach((item, index) => {
                if (item.checked) {
                    this.carts.splice(index, 1);
                }
            })
            this.$router.push("/paysuccess");
        }
    }
}
</script>
<style scoped>
.address {
    color: #515155;
    padding: 16px 20px;
    line-height: 23px;
    background: url('~@/assets/bg-addr-box-line.png') #fff left bottom repeat-x;
    background-size: 50px;
    margin-bottom: 10px;
}

.address .addr-title {
    font-size: 18px;
}

.address .addr-title span {
    margin-right: 10px;
}

.address .addr-info {
    color: #717171;
    font-size: 15px;
}

.pay-item .title {
    padding: 16px 20px;
    border-bottom: solid 1px #eee;
}
</style>
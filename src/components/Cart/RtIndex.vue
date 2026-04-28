<template>
    <van-nav-bar class="title" title="购物车" left-text="返回" left-arrow @click-left="onClickLeft" />
    <div class="cart-list">
        <van-checkbox-group v-model="checkedList" ref="cartList" @change="handleChecked">
            <rt-item :item="cart" @sendUpdate="onUpdate" v-for="cart, key in carts" :key="key"></rt-item>
        </van-checkbox-group>
    </div>
    <div class="cart-noprod" v-show="carts.length == 0">
        <div class="noprod">
        <van-image :src="noprod" width="160" />
        <h3>购物车是空的哦，快去购物吧</h3>
        <router-link class="noprod-go" :to="'/shop'">逛一逛</router-link>
    </div>
    </div>
    <van-submit-bar v-show="carts.length > 0" :disabled="checkedList.length==0" :price="sumPrice * 100" button-text="提交订单" @submit="onSubmit">
        <van-checkbox v-model="blnAllChecked" @change="toggleAll">全选</van-checkbox>
    </van-submit-bar>
</template>
<script>
import { mapState, mapActions } from 'pinia'
import { shopStore } from "@/store/shopStore"
import RtItem from "./components/RtItem.vue"
import noprod from "@/assets/Cartlogo.png";
export default {
    data() {
        return {
            blnAllChecked: false,
            noprod: noprod,
            defaultValue: [],
            checkedList: [],
            sumPrice: 0
        }
    },
    computed: {
        ...mapState(shopStore, ["carts","addressInfo"])
    },
    components: {
        RtItem
    },
    mounted() {
        this.countSumPrice();
    },
    methods: {
        ...mapActions(shopStore, ["upd_carts_checked_act", "count_sum_price_act"]),
        onClickLeft() {
            history.back();
        },
        onUpdate(){
           this.countSumPrice();
        },
        handleChecked() {
            this.blnAllChecked = this.checkedList.length == this.carts.length;
            this.countSumPrice();
        },
        blnCheckedById(id) {
            let _item = this.checkedList.find(item => item == id);
            return _item ? true : false;
        },
        countSumPrice() {
            let _sumPrice = 0;
            this.carts.forEach(item => {
                if (this.blnCheckedById(item.id)) {
                    _sumPrice += item.num * item.price;
                }
            })
            this.sumPrice = _sumPrice;
        },
        onSubmit() {
            console.log(this.checkedList)
            this.carts.forEach(item => {
                if (this.blnCheckedById(item.id)) {
                    item.checked = true;
                }else{
                    item.checked = false;
                }
            })
            if(this.addressInfo.length>0){
                this.$router.push("/pay")
            }else{
                this.$router.push("/addresslist?source=pay")
            }
        },
        toggleAll(blnAllChecked) {
            if (blnAllChecked) {
                this.checkedList = this.carts.map(item => item.id);
            } else {
                let checkedCount = this.checkedList.length;
                if (checkedCount === this.carts.length) {
                    this.checkedList = [];
                }
            }
            this.countSumPrice();
        }
    }
}
</script>
<style scoped>
.title {
  background: linear-gradient(90deg, #4A1414, #8B4513, #EDEDED);
}

.title >>> .van-nav-bar__title {
  font-size: 18px; /* 字体大小 */
  font-weight: bold; /* 字体粗细 */
  color: #ffffff; /* 字体颜色 */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5); /* 文字阴影 */
  letter-spacing: 1px; /* 字间距 */
}

.cart-noprod {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 500px;
}
.noprod{
    text-align: center;
}
.noprod-go{
    background-color: red;
    color:#fff;
    padding: 10px 20px;
    margin-top: 20px;
    border-radius: 8px;
    display: inline-block;
}
</style>
<template>
   <van-nav-bar title="我的订单" left-text="返回" left-arrow @click-left="onClickLeft" />
   <van-tabs v-model:active="active">
     <van-tab title="全部">
       <div class="i-item" v-for="item in orders" :key="item.id">
         <van-card
           v-for="item2 in item.prods"
           :key="item2.id"
           :num="item2.num"
           :price="item2.price"
           :desc="'描述信息'"
           :title="item2.title"
           :thumb="item2.img"
         >
           <template #footer>
             <van-button size="small" type="danger" @click="delete_orders_act(item.id)">取消订单</van-button>
           </template>
         </van-card>
         <div class="i-tip">
           共计:<span>{{ item.prods.length }}</span>件
           商品总价:
           <span>¥ {{ item.sumPrice }}</span>
         </div>
       </div>
     </van-tab>
     <van-tab title="待付款"></van-tab>
     <van-tab title="待收货"></van-tab>
     <van-tab title="待评价"></van-tab>
   </van-tabs>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import { shopStore } from '@/store/shopStore';
import { useRouter } from 'vue-router';

export default {
   data() {
     return {
       active: 0,
       router: useRouter(),
     };
   },
   computed: {
     ...mapState(shopStore, ['orders']),
   },
   methods: {
     ...mapActions(shopStore, ['delete_orders_act']),
     onClickLeft() {
       history.back();
     },
   },
   mounted() {
     // 获取传入的参数
     this.active = parseInt(this.router.currentRoute.params.active || 0);
   },
};
</script>

<style scoped>
.i-item {
   padding: 10px 15px;
   border-bottom: solid 1px #eee;
   position: relative;
}
.i-tip {
   position: absolute;
   bottom: 20px;
   left: 30px;
   font-size: 15px;
}
.i-tip span {
   color: red;
}
</style>
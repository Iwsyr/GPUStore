<template>
   <van-nav-bar title="我的收藏" left-text="返回" left-arrow @click-left="onClickLeft" />
   <van-tabs v-model:active="active">
     <van-tab title="商品">
       <div class="c-item" v-for="item in cprods" :key="item.id">
         <van-image width="100" height="100" :src="getProdById(item.id).swiper[0].src" />
         <div class="c-info">
           <div class="c-title">
             <h3>{{ getProdById(item.id).title }}</h3>
             <p class="price">{{ getProdById(item.id).price }}</p>
           </div>
         </div>
         <div class="c-dele">
           <van-icon name="delete-o" class="d-icon" size="23" @click="delCollects(item.id)" />
           <van-icon name="cart" color="red" class="d-icon d-icon-last" size="35" @click="addCollects(item.id)" />
         </div>
       </div>
     </van-tab>
     <van-tab title="文章">
       <div class="c-item" v-for="item in cnews" :key="item.id">
         <div class="c-info">
           <div class="c-title">
             <h3>{{ getNewsById(item.id)?.title || '无标题' }}</h3>
             <p class="desc">{{ getNewsById(item.id)?.desc || '无描述' }}</p>
           </div>
         </div>
         <div class="c-dele">
           <van-icon name="delete-o" class="d-icon" size="23" @click="delCollects(item.id)" />
         </div>
       </div>
     </van-tab>
   </van-tabs>
</template>

<script>
import data from "@/components/Shop/shop";

import { mapState, mapActions } from "pinia";
import { shopStore } from "@/store/shopStore";

export default {
   data() {
     return {
       active: 0,
       cprods: [],
       cnews: []
     };
   },
   computed: {
     ...mapState(shopStore, ["collects"])
   },
   methods: {
     ...mapActions(shopStore, ["del_collect_act", "add_carts_act"]),
     onClickLeft() {
       history.back();
     },
     delCollects(id) {
       this.del_collect_act(id);
       if (this.active) {
         this.cnews = this.collects.filter(item => item.type === 2);
       } else {
         this.cprods = this.collects.filter(item => item.type === 1);
       }
     },
     addCollects(id) {
       let prod = data.prods.find(item => item.id === id);
       let _prod = {
         id: prod.id,
         title: prod.title,
         num: 1,
         price: prod.price,
         img: prod.swiper[0].src,
         type: 1 // 1表示商品类型
       };
       this.add_carts_act(_prod);
       this.$router.push("/cart");
     },
     getProdById(id) {
       return data.prods.find(item => item.id === id);
     },
     getNewsById(id) {
       return data.news.find(item => item.id === id);
     }
   },
   mounted() {
     this.cprods = this.collects.filter(item => item.type === 1);
     this.cnews = this.collects.filter(item => item.type === 2);
   }
};
</script>

<style scoped>
.c-item {
   padding: 15px 20px;
   border-bottom: solid 1px #eee;
   display: flex;
   align-items: center;
}

.c-item .van-checkbox__icon {
   margin-right: 10px;
}

.c-info {
   display: flex;
   align-items: center;
   justify-content: space-between;
   width: 100%;
   line-height: 25px;
   color: #515151;
   margin-left: 5px;
}

.c-info .c-title h3 {
   font-size: 16px;
}

.c-info .c-title .price {
   font-size: 13px;
   color: red;
}

.c-info .c-title .btys {
   display: flex;
   align-items: center;
}

.c-info .c-title .btys .num {
   padding: 2px 12px;
   font-size: 12px;
}

.c-dele {
   height: 95px;
}

.d-icon {
   display: block;
}

.d-icon-last {
   margin-top: 36px;
   margin-left: -13px;
}
</style>
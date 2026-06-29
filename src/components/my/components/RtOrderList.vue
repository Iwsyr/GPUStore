<template>
   <van-nav-bar title="我的订单" left-text="返回" left-arrow @click-left="onClickLeft" />
   <van-tabs v-model:active="active">
     <van-tab v-for="tab in statusTabs" :key="tab.title" :title="tab.title">
       <div class="i-item" v-for="item in filteredOrders(tab.filter)" :key="item.id">
         <div class="order-header">
           <span class="order-id">订单号: {{ item.id }}</span>
           <span class="order-status" :class="'status-' + item.status">{{ statusMap[item.status] || item.status }}</span>
         </div>
         <van-card
           v-for="item2 in item.prods"
           :key="item2.id"
           :num="item2.num"
           :price="item2.price"
           :desc="'描述信息'"
           :title="item2.title"
           :thumb="item2.img"
         />
         <div class="order-footer">
           <div class="order-total">
             共计 <span>{{ item.prods.length }}</span> 件，总价 <span class="total-price">¥ {{ item.sumPrice }}</span>
           </div>
           <div class="order-actions">
             <van-button v-if="item.status === 'pending'" size="small" type="danger" @click="onCancelOrder(item.id)">取消订单</van-button>
             <van-button v-if="item.status === 'pending'" size="small" type="primary" @click="onPayOrder(item.id)">立即付款</van-button>
             <van-button v-if="item.status === 'shipped'" size="small" type="primary" @click="onConfirmReceive(item.id)">确认收货</van-button>
             <van-button v-if="item.status === 'delivered'" size="small" type="primary" @click="onGoReview(item.id)">去评价</van-button>
             <van-button v-if="['completed','cancelled'].includes(item.status)" size="small" @click="onDeleteOrder(item.id)">删除订单</van-button>
           </div>
         </div>
       </div>
       <van-empty v-if="filteredOrders(tab.filter).length === 0" :description="`暂无${tab.title}订单`" />
     </van-tab>
   </van-tabs>
</template>

<script>
import { shopStore } from '@/store/shopStore';
import { orderAPI } from '@/services/api';
import { showToast, showConfirmDialog } from 'vant';

export default {
   data() {
     return {
       active: 0,
       orders: [],
       statusMap: {
         'pending': '待付款',
         'paid': '待发货',
         'shipped': '待收货',
         'delivered': '待评价',
         'completed': '已完成',
         'cancelled': '已取消'
       },
       statusTabs: [
         { title: '全部', filter: null },
         { title: '待付款', filter: 'pending' },
         { title: '待收货', filter: ['paid', 'shipped'] },
         { title: '待评价', filter: 'delivered' }
       ]
     };
   },
   methods: {
     onClickLeft() {
       this.$router.push('/my');
     },
     filteredOrders(filter) {
       if (!filter) return this.orders;
       if (Array.isArray(filter)) {
         return this.orders.filter(o => filter.includes(o.status));
       }
       return this.orders.filter(o => o.status === filter);
     },
     async loadOrders() {
         const store = shopStore();
         try {
           const result = await orderAPI.getOrders();
           // 以数据库真实订单为准，按 id 去重合并
           // 将后端订单格式化
           const formatted = result.map(order => ({
             id: order.id,
             user_id: order.user_id,
             total_price: order.total_price,
             status: order.status,
             created_at: order.created_at,
             items: (order.items || []).map(item => ({
               product_id: item.product_id,
               product_name: item.product_name,
               price: item.price,
               quantity: item.quantity,
               image_url: item.image_url
             }))
           }));

           // 合并策略：后端订单优先覆盖本地，同时保留本地独有的订单
           const merged = [];
           const seen = new Set();
           for (const o of formatted) {
             merged.push(o);
             seen.add(o.id);
           }
           for (const o of store.orders) {
             if (!seen.has(o.id)) {
               merged.push(o);
             }
           }
           // 按创建时间倒序排列
           merged.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
           store.orders = merged;
         } catch (error) {
           console.warn('获取后端订单失败:', error.message);
         }
         this.orders = store.orders.map(order => ({
            id: order.id,
            sumPrice: order.total_price,
            status: order.status,
            date: order.created_at,
            prods: (order.items || []).map(item => ({
              id: item.product_id,
              title: item.product_name,
              price: item.price,
              num: item.quantity,
              img: item.image_url
            }))
          }));
      },
      async onCancelOrder(id) {
         showConfirmDialog({
           title: '提示',
           message: '确定要取消该订单吗？'
         }).then(async () => {
           try {
             await orderAPI.cancelOrder(id);
             showToast('订单已取消');
             await this.loadOrders();
           } catch (err) {
             showToast(err.response?.data?.message || '取消失败');
           }
         }).catch(() => {});
      },
      onPayOrder(id) {
        // 跳转到支付页面（可携带订单 ID）
        this.$router.push({ path: '/pay', query: { orderId: id } });
      },
      async onConfirmReceive(id) {
        showConfirmDialog({
          title: '确认收货',
          message: '确认已收到商品？'
        }).then(async () => {
          try {
            await orderAPI.updateOrderStatus(id, 'delivered');
            showToast('已确认收货');
            await this.loadOrders();
          } catch (err) {
            showToast(err.response?.data?.message || '操作失败');
          }
        }).catch(() => {});
      },
      onGoReview(id) {
        // 跳转到评价页面
        this.$router.push({ path: '/review', query: { orderId: id } });
      },
      async onDeleteOrder(id) {
        showConfirmDialog({
          title: '提示',
          message: '删除后无法恢复，确定删除吗？'
        }).then(async () => {
          try {
            await orderAPI.deleteOrder(id);
            const store = shopStore();
            store.orders = store.orders.filter(o => o.id !== id);
            this.orders = this.orders.filter(o => o.id !== id);
            showToast('订单已删除');
          } catch (err) {
            showToast(err.response?.data?.message || '删除失败');
          }
        }).catch(() => {});
      }
   },
   async mounted() {
     // 支持 URL 参数定位 tab
     const queryActive = parseInt(this.$route.query.active || this.$route.params.active || 0);
     this.active = queryActive;
     await this.loadOrders();
   },
};
</script>

<style scoped>
.i-item {
   padding: 10px 15px;
   border-bottom: solid 1px #eee;
   background: #fff;
   margin-bottom: 8px;
}
.order-header {
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding: 8px 0;
   font-size: 14px;
   color: #666;
}
.order-id {
   color: #999;
}
.order-status {
   font-weight: bold;
}
.status-pending { color: #ff976a; }
.status-paid { color: #1989fa; }
.status-shipped { color: #07c160; }
.status-delivered { color: #ee0a24; }
.status-completed { color: #969799; }
.status-cancelled { color: #969799; text-decoration: line-through; }
.order-footer {
   padding: 10px 0;
   border-top: 1px solid #f5f5f5;
}
.order-total {
   text-align: right;
   font-size: 14px;
   color: #333;
   margin-bottom: 10px;
}
.order-total span {
   color: #ee0a24;
   font-weight: bold;
}
.total-price {
   font-size: 16px;
}
.order-actions {
   display: flex;
   justify-content: flex-end;
   gap: 8px;
}
</style>

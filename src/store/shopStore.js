import { defineStore } from "pinia";

export const shopStore = defineStore("shop_id", {
  state: () => ({
    collects: [],
    likes: [],
    userInfo: {
      name: '冰可乐商城',
      desc: '专注于显卡的商城'
    },
    addressInfo: [],
    carts: [],
    orders: []
  }),

  actions: {
    // 收藏相关
    add_collect_act(data) {
      if (!this.collects.some(item => item == data)) {
        this.collects.push(data);
      }
    },
    
    del_collect_act(id) {
      const index = this.collects.findIndex(item => item.id == id);
      if (index !== -1) this.collects.splice(index, 1);
    },

    // 喜欢相关
    add_like_act(data) {
      if (!this.likes.some(item => item == data)) {
        this.likes.push(data);
      }
    },
    
    remove_like_act(data) {
      const index = this.likes.findIndex(item => item == data);
      if (index !== -1) this.likes.splice(index, 1);
    },

    // 用户信息
    edit_userInfo_act(data) {
      this.userInfo = data;
    },

    // 地址相关
    add_addressInfo_act(data) {
      data.id = this.addressInfo.length + 1;
      data.address = `${data.country}${data.province}${data.city}${data.county}${data.addressDetail}`;
      this.addressInfo.push(data);
    },
    
    edit_addressInfo_act(index, data) {
      this.addressInfo[index] = data;
    },
    
    delete_addressInfo_act(index) {
      this.addressInfo.splice(index, 1);
    },

    // 购物车相关
    edit_carts_num_act(data, type) {
      const cart = this.carts.find(item => item.id === data.id);
      if (!cart) return;
      
      cart.num = typeof cart.num === 'number' ? cart.num : 1;
      
      if (type === 'add') cart.num++;
      else cart.num = Math.max(1, cart.num - 1);
    },
    
    delete_carts_act(id) {
      return new Promise(resolve => {
        this.carts = this.carts.filter(item => item.id !== id);
        resolve();
      });
    },
    
    add_carts_act(data) {
      return new Promise(resolve => {
        const cart = this.carts.find(item => item.id === data.id);
        
        if (!cart) {
          data.num = typeof data.num === 'number' ? data.num : 1;
          this.carts.push(data);
        } else {
          cart.num += data.num || 1;
        }
        
        resolve();
      });
    },

    // 订单相关
    add_orders_act(data) {
      data.id = `rt${this.orders.length + 1}`;
      this.orders.push(data);
    },
    
    delete_orders_act(id) {
      const index = this.orders.findIndex(item => item.id == id);
      if (index !== -1) this.orders.splice(index, 1);
    },

    // 修改购物车勾选状态方法
    upd_carts_checked_act(id, checked) {
      const cart = this.carts.find(item => item.id === id);
      if (cart) {
        cart.checked = checked;
      }
    },

    // 添加获取已勾选商品的方法
    getCheckedCarts() {
      return this.carts.filter(item => item.checked);
    }
  },

  persist: {
    enabled: true,
    strategies: [{
      storage: localStorage,
      paths: ['collects', 'likes', 'userInfo', 'addressInfo', 'carts', 'orders']
    }]
  }
});

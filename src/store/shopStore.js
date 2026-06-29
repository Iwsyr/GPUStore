import { defineStore } from "pinia";
import { productAPI, cartAPI, orderAPI, addressAPI, favoriteAPI } from '@/services/api';
import { resolveAssetUrl } from '@/utils/image';
import { useAuthStore } from './authStore';

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
    orders: [],
    products: [],
    currentUserId: 1,
    addressLoaded: false,
    collectLoaded: false,
    likesLoaded: false,
    ordersLoaded: false
  }),

  getters: {
    currentUserIdFromAuth() {
      const auth = useAuthStore();
      return auth.currentUser?.id || null;
    }
  },

  actions: {
    initUserId() {
      const auth = useAuthStore();
      if (auth.currentUser?.id) {
        this.currentUserId = auth.currentUser.id;
      }
    },

    async fetchProducts() {
      try {
        const products = await productAPI.getProducts();
        this.products = products.map(product => ({
          ...product,
          image_url: product.image_url,
          src: resolveAssetUrl(product.image_url)
        }));
        return this.products;
      } catch (error) {
        console.error('获取产品失败:', error);
        return [];
      }
    },

    async fetchCart() {
      try {
        const cartItems = await cartAPI.getCart();
        this.carts = cartItems.map(item => ({
          id: item.id,
          product_id: item.product_id,
          title: item.title,
          price: item.price,
          image: resolveAssetUrl(item.image_url),
          num: item.quantity,
          checked: false,
          stock: item.stock
        }));
        return this.carts;
      } catch (error) {
        console.error('获取购物车失败:', error);
        return [];
      }
    },

    async removeFromCartAPI(cartId) {
      try {
        await cartAPI.removeFromCart(cartId);
      } catch (error) {
        console.error('删除购物车项失败:', error);
      }
      await this.fetchCart();
    },

    async createOrderAPI(orderData) {
      const store = this;
      const checkedCarts = this.getCheckedCarts();

      // 1. 先调用后端创建订单
      let backendOrder;
      try {
        backendOrder = await orderAPI.createOrder({
          items: (orderData.items || []).map(item => ({
            product_id: item.product_id,
            quantity: item.quantity || item.num || 1
          }))
        });
      } catch (error) {
        // 后端失败：抛出错误，让调用方处理，购物车不动
        console.error('后端创建订单失败:', error);
        throw error;
      }

      // 2. 后端成功：清空购物车（删除后端购物车项 + 更新本地状态）
      const checkedIds = checkedCarts.map(c => c.id);
      for (const cart of checkedCarts) {
        try {
          await cartAPI.removeFromCart(cart.id);
        } catch (error) {
          console.warn('删除购物车项失败:', error.message);
        }
      }
      store.carts = store.carts.filter(c => !checkedIds.includes(c.id));

      // 3. 用后端返回的真实订单数据更新本地 store
      const realOrder = {
        id: backendOrder.id,
        user_id: backendOrder.user_id,
        total_price: backendOrder.total_price,
        status: backendOrder.status,
        created_at: backendOrder.created_at,
        items: (backendOrder.items || []).map(item => ({
          product_id: item.product_id,
          product_name: item.product_name,
          price: item.price,
          quantity: item.quantity,
          image_url: item.image_url
        }))
      };
      store.orders = [realOrder, ...store.orders];
      return realOrder;
    },

    // ==================== 收藏（后端同步） ====================
    async fetchCollects() {
      try {
        const items = await favoriteAPI.getFavorites();
        this.collects = items
          .filter(item => item.type === 'collect')
          .map(item => ({
            id: item.product_id,
            type: item.target_type === 'news' ? 2 : 1,
            _favid: item.id,
            title: item.title,
            desc: item.desc_text
          }));
        this.collectLoaded = true;
        return this.collects;
      } catch (error) {
        console.error('获取收藏失败:', error);
        return [];
      }
    },

    async add_collect_act(data) {
      const auth = useAuthStore();
      const userId = auth.currentUser?.id || this.currentUserId;
      try {
        const targetType = data.type === 2 ? 'news' : 'product';
        await favoriteAPI.addFavorite({
          user_id: userId,
          product_id: data.id,
          type: 'collect',
          target_type: targetType,
          title: data.title || '',
          desc_text: data.desc || ''
        });
        await this.fetchCollects();
      } catch (error) {
        console.error('添加收藏失败:', error);
      }
    },

    async del_collect_act(id) {
      const item = this.collects.find(c => c.id == id);
      const favId = item?._favid;
      if (favId) {
        try {
          await favoriteAPI.removeFavorite(favId);
        } catch (error) {
          console.error('删除收藏失败:', error);
        }
      }
      this.collects = this.collects.filter(item => item.id != id);
    },

    // ==================== 点赞（后端同步） ====================
    async fetchLikes() {
      try {
        const items = await favoriteAPI.getFavorites();
        this.likes = items
          .filter(item => item.type === 'like')
          .map(item => item.product_id);
        this.likesLoaded = true;
        return this.likes;
      } catch (error) {
        console.error('获取点赞失败:', error);
        return [];
      }
    },

    async add_like_act(data) {
      const auth = useAuthStore();
      const userId = auth.currentUser?.id || this.currentUserId;
      try {
        await favoriteAPI.addFavorite({
          user_id: userId,
          product_id: data,
          type: 'like'
        });
        await this.fetchLikes();
      } catch (error) {
        console.error('添加点赞失败:', error);
      }
    },

    async remove_like_act(data) {
      try {
        const items = await favoriteAPI.getFavorites();
        const likeItem = items.find(item => item.type === 'like' && item.product_id == data);
        if (likeItem) {
          await favoriteAPI.removeFavorite(likeItem.id);
        }
      } catch (error) {
        console.error('取消点赞失败:', error);
      }
      this.likes = this.likes.filter(item => item != data);
    },

    edit_userInfo_act(data) {
      this.userInfo = data;
    },

    // ==================== 地址（后端同步） ====================
    async fetchAddresses() {
      try {
        const items = await addressAPI.getAddresses();
        this.addressInfo = items.map(item => ({
          id: String(item.id),
          name: item.name,
          tel: item.tel,
          country: item.country,
          province: item.province,
          city: item.city,
          county: item.county,
          addressDetail: item.addressDetail,
          address: item.address,
          isDefault: !!item.isDefault
        }));
        this.addressLoaded = true;
        return this.addressInfo;
      } catch (error) {
        console.error('获取地址失败:', error);
        return [];
      }
    },

    async add_addressInfo_act(data) {
      const auth = useAuthStore();
      const userId = auth.currentUser?.id || this.currentUserId;
      const fullAddress = `${data.country || ''}${data.province || ''}${data.city || ''}${data.county || ''}${data.addressDetail || ''}`;
      try {
        const res = await addressAPI.addAddress({
          user_id: userId,
          name: data.name,
          tel: data.tel,
          country: data.country || '',
          province: data.province || '',
          city: data.city || '',
          county: data.county || '',
          addressDetail: data.addressDetail || '',
          address: fullAddress,
          isDefault: data.isDefault || false
        });
        await this.fetchAddresses();
        return res;
      } catch (error) {
        console.error('添加地址失败:', error);
        throw error;
      }
    },

    async edit_addressInfo_act(index, data) {
      const item = this.addressInfo[index];
      if (!item) return;
      const fullAddress = `${data.country || ''}${data.province || ''}${data.city || ''}${data.county || ''}${data.addressDetail || ''}`;
      try {
        await addressAPI.updateAddress(parseInt(item.id), {
          user_id: this.currentUserId,
          name: data.name,
          tel: data.tel,
          country: data.country || '',
          province: data.province || '',
          city: data.city || '',
          county: data.county || '',
          addressDetail: data.addressDetail || '',
          address: fullAddress,
          isDefault: data.isDefault || false
        });
        await this.fetchAddresses();
      } catch (error) {
        console.error('更新地址失败:', error);
        throw error;
      }
    },

    async delete_addressInfo_act(index) {
      const item = this.addressInfo[index];
      if (!item) return;
      try {
        await addressAPI.deleteAddress(parseInt(item.id));
        await this.fetchAddresses();
      } catch (error) {
        console.error('删除地址失败:', error);
        throw error;
      }
    },

    async edit_carts_num_act(data, type) {
      const cart = this.carts.find(item => item.id === data.id);
      if (!cart) return;
      cart.num = typeof cart.num === 'number' ? cart.num : 1;
      if (type === 'add') cart.num++;
      else cart.num = Math.max(1, cart.num - 1);
      try {
        await cartAPI.updateCart(cart.id, { quantity: cart.num });
      } catch (error) {
        console.error('更新购物车数量失败:', error);
      }
    },

    async delete_carts_act(id) {
      try {
        await cartAPI.removeFromCart(id);
      } catch (error) {
        console.error('删除购物车项失败:', error);
      }
      this.carts = this.carts.filter(item => item.id !== id);
    },

    async add_carts_act(data) {
      try {
        await cartAPI.addToCart({
          user_id: this.currentUserId,
          product_id: data.product_id || data.id,
          quantity: data.num || 1
        });
        await this.fetchCart();
      } catch (error) {
        console.error('添加购物车失败:', error);
      }
    },

    // ==================== 订单（后端同步） ====================
    async fetchOrders() {
      try {
        const items = await orderAPI.getOrders();
        this.orders = items;
        this.ordersLoaded = true;
        return this.orders;
      } catch (error) {
        console.error('获取订单失败:', error);
        return [];
      }
    },

    upd_carts_checked_act(id, checked) {
      const cart = this.carts.find(item => item.id === id);
      if (cart) {
        cart.checked = checked;
      }
    },

    getCheckedCarts() {
      return this.carts.filter(item => item.checked);
    }
  },

  persist: {
    enabled: true,
    strategies: [{
      storage: localStorage,
      paths: ['userInfo']
    }]
  }
});

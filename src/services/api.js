import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || '/api',
  timeout: 10000,
});

// 请求拦截器（可选，用于添加认证头）
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// 响应拦截器（可选，用于处理错误）
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (username, password) => api.post('/auth/login', { username, password }).then(res => res.data),
  register: (data) => api.post('/auth/register', data).then(res => res.data),
  getMe: () => api.get('/auth/me').then(res => res.data)
};

// API方法
export const productAPI = {
  // 获取产品列表
  getProducts: () => api.get('/products').then(res => res.data),

  // 获取单个产品
  getProduct: (id) => api.get(`/products/${id}`).then(res => res.data),

  // 添加产品
  addProduct: (product) => api.post('/products', product).then(res => res.data),

  // 更新产品
  updateProduct: (id, product) => api.put(`/products/${id}`, product).then(res => res.data),

  // 删除产品
  deleteProduct: (id) => api.delete(`/products/${id}`).then(res => res.data),
};

export const cartAPI = {
  // 获取购物车
  getCart: () => api.get('/carts').then(res => res.data),

  // 添加到购物车
  addToCart: (cartItem) => api.post('/carts', cartItem).then(res => res.data),

  // 删除购物车项
  removeFromCart: (id) => api.delete(`/carts/${id}`).then(res => res.data),

  // 更新购物车项数量
  updateCart: (id, data) => api.put(`/carts/${id}`, data).then(res => res.data),
};

export const orderAPI = {
  // 获取订单列表
  getOrders: () => api.get('/orders').then(res => res.data),

  // 获取单个订单
  getOrder: (id) => api.get(`/orders/${id}`).then(res => res.data),

  // 创建订单
  createOrder: (order) => api.post('/orders', order).then(res => res.data),

  // 取消订单
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`).then(res => res.data),

  // 更新订单状态
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }).then(res => res.data),

  // 删除订单
  deleteOrder: (id) => api.delete(`/orders/${id}`).then(res => res.data),
};

export const adminAPI = {
  // 获取所有订单
  getAllOrders: () => api.get('/admin/orders'),

  // 获取所有用户
  getAllUsers: () => api.get('/admin/users'),

  // 获取库存列表
  getInventory: (params) => api.get('/admin/inventory', { params }).then(res => res.data),

  // 修改单个商品库存
  updateInventory: (id, stock) => api.put(`/admin/inventory/${id}`, { stock }).then(res => res.data),

  // 批量修改库存
  batchUpdateInventory: (items) => api.put('/admin/inventory/batch', { items }).then(res => res.data),
};

export const newsAPI = {
  getNews: () => api.get('/news').then(res => res.data),
  getNewsDetail: (id) => api.get(`/news/${id}`).then(res => res.data)
};

export const categoryAPI = {
  getCategories: () => api.get('/categories').then(res => res.data)
};

export const productSummaryAPI = {
  getSummaries: () => api.get('/products/summary/list').then(res => res.data)
};

export const productImagesAPI = {
  getImages: (productId) => api.get(`/products/${productId}/images`).then(res => res.data)
};

export const addressAPI = {
  getAddresses: () => api.get('/addresses').then(res => res.data),
  addAddress: (data) => api.post('/addresses', data).then(res => res.data),
  updateAddress: (id, data) => api.put(`/addresses/${id}`, data).then(res => res.data),
  deleteAddress: (id) => api.delete(`/addresses/${id}`).then(res => res.data)
};

export const favoriteAPI = {
  getFavorites: () => api.get('/favorites').then(res => res.data),
  addFavorite: (data) => api.post('/favorites', data).then(res => res.data),
  removeFavorite: (id) => api.delete(`/favorites/${id}`).then(res => res.data)
};

export const reviewAPI = {
  submitReview: (data) => api.post('/reviews', data).then(res => res.data),
  getProductReviews: (productId) => api.get('/reviews', { params: { product_id: productId } }).then(res => res.data)
};

export default api;
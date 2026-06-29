<template>
  <div class="admin-page">
    <van-nav-bar title="管理中心" left-text="返回" left-arrow @click-left="$router.push('/my')" />
    <van-tabs v-model:active="active">
      <van-tab title="订单管理">
        <van-cell-group v-for="item in orders" :key="item.id">
          <van-cell :title="'订单 #' + item.id" :label="'用户: ' + (item.username || '未知') + ' | 金额: ¥' + item.total_price" :value="item.status" />
        </van-cell-group>
        <van-empty v-if="orders.length === 0" description="暂无订单" />
      </van-tab>
      <van-tab title="用户管理">
        <van-cell-group v-for="item in users" :key="item.id">
          <van-cell :title="item.username" :label="'邮箱: ' + (item.email || '无') + ' | 角色: ' + item.role" />
        </van-cell-group>
        <van-empty v-if="users.length === 0" description="暂无用户" />
      </van-tab>
      <van-tab title="库存管理">
        <div class="inventory-header">
          <van-search v-model="searchKey" placeholder="按商品名称搜索" @search="loadInventory" @clear="loadInventory" />
          <div class="inventory-filter">
            <van-tabs v-model:active="statusFilter" @click-tab="loadInventory">
              <van-tab title="全部" name=""></van-tab>
              <van-tab title="充足" name="充足"></van-tab>
              <van-tab title="紧张" name="紧张"></van-tab>
              <van-tab title="缺货预警" name="缺货预警"></van-tab>
            </van-tabs>
          </div>
        </div>
        <div class="inventory-list">
          <van-cell-group v-for="item in inventoryList" :key="item.id">
            <van-cell>
              <template #title>
                <div class="inventory-cell">
                  <span class="prod-name">{{ item.name }}</span>
                  <span class="prod-stock">库存: {{ item.stock }}</span>
                  <van-tag :color="stockTagColor(item.status)" size="small">{{ item.status }}</van-tag>
                </div>
              </template>
              <template #value>
                <van-button size="small" type="primary" @click="openEditDialog(item)">编辑</van-button>
              </template>
            </van-cell>
          </van-cell-group>
          <van-empty v-if="inventoryList.length === 0" description="暂无库存数据" />
        </div>
        <div class="inventory-pagination">
          <van-pagination v-model="currentPage" :page-count="totalPages" mode="simple" @change="loadInventory" />
        </div>
        <van-dialog v-model:show="showEditDialog" title="修改库存" show-cancel-button @confirm="confirmEdit" @cancel="resetEditForm">
          <div class="edit-form">
            <van-field v-model="editForm.name" label="商品名称" readonly />
            <van-field v-model="editForm.stock" label="库存数量" type="digit" placeholder="请输入非负整数" :rules="stockRules" />
          </div>
        </van-dialog>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { adminAPI } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { showToast } from 'vant';

export default {
  name: 'AdminPage',
  data() {
    return {
      active: 0,
      orders: [],
      users: [],
      searchKey: '',
      statusFilter: '',
      inventoryList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      showEditDialog: false,
      editForm: {
        id: null,
        name: '',
        stock: ''
      },
      stockRules: [
        { validator: (val) => /^\d+$/.test(val) && parseInt(val) >= 0, message: '请输入非负整数' }
      ]
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.total / this.pageSize) || 1;
    }
  },
  async mounted() {
    const authStore = useAuthStore();
    if (!authStore.isAdmin) {
      this.$router.push('/home');
      return;
    }
    await this.loadOrders();
    await this.loadUsers();
    await this.loadInventory();
  },
  methods: {
    async loadOrders() {
      try {
        const res = await adminAPI.getAllOrders();
        this.orders = res.data || res;
      } catch (err) {
        console.error('加载订单失败:', err);
      }
    },
    async loadUsers() {
      try {
        const res = await adminAPI.getAllUsers();
        this.users = res.data || res;
      } catch (err) {
        console.error('加载用户失败:', err);
      }
    },
    async loadInventory() {
      try {
        const params = {
          page: this.currentPage,
          pageSize: this.pageSize,
          search: this.searchKey || undefined,
          status: this.statusFilter || undefined
        };
        const res = await adminAPI.getInventory(params);
        this.inventoryList = res.data || [];
        this.total = res.total || 0;
        this.currentPage = res.page || 1;
      } catch (err) {
        console.error('加载库存失败:', err);
        showToast('加载库存失败');
      }
    },
    stockTagColor(status) {
      if (status === '充足') return '#07c160';
      if (status === '紧张') return '#ff976a';
      if (status === '缺货预警') return '#ee0a24';
      return '#999';
    },
    openEditDialog(item) {
      this.editForm.id = item.id;
      this.editForm.name = item.name;
      this.editForm.stock = String(item.stock);
      this.showEditDialog = true;
    },
    resetEditForm() {
      this.editForm.id = null;
      this.editForm.name = '';
      this.editForm.stock = '';
    },
    async confirmEdit() {
      const stockNum = parseInt(this.editForm.stock);
      if (isNaN(stockNum) || stockNum < 0) {
        showToast('请输入有效的非负整数');
        return;
      }
      try {
        await adminAPI.updateInventory(this.editForm.id, stockNum);
        showToast('库存更新成功');
        this.showEditDialog = false;
        this.resetEditForm();
        await this.loadInventory();
      } catch (err) {
        const msg = err.response?.data?.message || '更新库存失败';
        showToast(msg);
      }
    }
  }
};
</script>

<style scoped>
.inventory-header {
  background: #fff;
}
.inventory-filter {
  margin: 0 16px;
}
.inventory-list {
  margin-bottom: 10px;
}
.inventory-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}
.prod-name {
  font-weight: 500;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.prod-stock {
  font-size: 13px;
  color: #666;
}
.inventory-pagination {
  padding: 10px 16px 20px;
}
.edit-form {
  padding: 16px;
}
</style>

<template>
  <div class="login-page">
    <div class="login-box">
      <h2>冰可乐显卡商城</h2>
      <van-form @submit="onLogin">
        <van-field v-model="username" name="username" label="用户名" placeholder="请输入用户名"
          :rules="[{ required: true, message: '请输入用户名' }]" />
        <van-field v-model="password" type="password" name="password" label="密码" placeholder="请输入密码"
          :rules="[{ required: true, message: '请输入密码' }]" />
        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit" :loading="loading">登录</van-button>
        </div>
      </van-form>
      <div class="register-link">
        还没有账号？<router-link to="/register">立即注册</router-link>
      </div>
      <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/store/authStore';
import { shopStore } from '@/store/shopStore';
import { showToast } from 'vant';

export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: '',
      loading: false,
      errorMsg: ''
    };
  },
  methods: {
    async onLogin() {
      this.loading = true;
      this.errorMsg = '';
      try {
        const authStore = useAuthStore();
        await authStore.login(this.username, this.password);
        const shop = shopStore();
        shop.initUserId();
        shop.edit_userInfo_act({
          name: authStore.currentUser?.username || this.username,
          desc: shop.userInfo.desc
        });
        showToast('登录成功');
        const redirect = this.$route.query.redirect || '/home';
        this.$router.push(redirect);
      } catch (err) {
        this.errorMsg = err.response?.data?.message || '登录失败';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.login-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4A1414, #8B4513, #EDEDED);
}
.login-box {
  width: 85%;
  max-width: 400px;
  background: #fff;
  border-radius: 12px;
  padding: 30px 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}
.login-box h2 {
  text-align: center;
  margin-bottom: 24px;
  color: #4A1414;
  font-size: 22px;
}
.register-link {
  text-align: center;
  font-size: 14px;
  color: #666;
}
.register-link a {
  color: #1989fa;
}
.error-msg {
  text-align: center;
  color: red;
  margin-top: 10px;
  font-size: 13px;
}
</style>
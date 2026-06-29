<template>
  <div class="register-page">
    <div class="register-box">
      <h2>用户注册</h2>
      <van-form @submit="onRegister">
        <van-field v-model="username" name="username" label="用户名" placeholder="请输入用户名"
          :rules="[{ required: true, message: '请输入用户名' }]" />
        <van-field v-model="email" name="email" label="邮箱" placeholder="请输入邮箱（选填）" />
        <van-field v-model="phone" name="phone" label="手机号" placeholder="请输入11位手机号"
          :rules="[
            { required: false },
            { pattern: /^1\d{10}$/, message: '请输入正确的11位手机号' }
          ]" />
        <van-field v-model="password" type="password" name="password" label="密码" placeholder="请输入密码（不少于6位）"
          :rules="[
            { required: true, message: '请输入密码' },
            { validator: (v) => v.length >= 6, message: '密码不少于6位' }
          ]" />
        <van-field v-model="confirmPassword" type="password" name="confirmPassword" label="确认密码" placeholder="请再次输入密码"
          :rules="[
            { required: true, message: '请确认密码' },
            { validator: (v) => v === password, message: '两次密码不一致' }
          ]" />
        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit" :loading="loading">注册</van-button>
        </div>
      </van-form>
      <div class="login-link">
        已有账号？<router-link to="/login">立即登录</router-link>
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
  name: 'RegisterPage',
  data() {
    return {
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      phone: '',
      loading: false,
      errorMsg: ''
    };
  },
  methods: {
    async onRegister() {
      this.loading = true;
      this.errorMsg = '';
      try {
        const authStore = useAuthStore();
        await authStore.register({
          username: this.username,
          password: this.password,
          confirmPassword: this.confirmPassword,
          email: this.email,
          phone: this.phone
        });
        const shop = shopStore();
        shop.initUserId();
        shop.edit_userInfo_act({
          name: authStore.currentUser?.username || this.username,
          desc: shop.userInfo.desc
        });
        showToast('注册成功');
        this.$router.push('/home');
      } catch (err) {
        this.errorMsg = err.response?.data?.message || '注册失败';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4A1414, #8B4513, #EDEDED);
  padding: 20px 0;
}
.register-box {
  width: 85%;
  max-width: 400px;
  background: #fff;
  border-radius: 12px;
  padding: 30px 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}
.register-box h2 {
  text-align: center;
  margin-bottom: 24px;
  color: #4A1414;
  font-size: 22px;
}
.login-link {
  text-align: center;
  font-size: 14px;
  color: #666;
}
.login-link a {
  color: #1989fa;
}
.error-msg {
  text-align: center;
  color: red;
  margin-top: 10px;
  font-size: 13px;
}
</style>
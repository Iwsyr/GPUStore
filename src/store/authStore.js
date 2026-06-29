import { defineStore } from 'pinia';
import { authAPI } from '@/services/api';

export const useAuthStore = defineStore('auth', {
  state: () => {
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      user = null;
      localStorage.removeItem('user');
    }
    return {
      token: localStorage.getItem('token') || '',
      user
    };
  },

  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
    currentUser: (state) => state.user
  },

  actions: {
    async login(username, password) {
      const res = await authAPI.login(username, password);
      this.token = res.token;
      this.user = res.user;
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      return res;
    },

    async register(data) {
      const res = await authAPI.register(data);
      this.token = res.token;
      this.user = res.user;
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      return res;
    },

    async fetchUserInfo() {
      try {
        const user = await authAPI.getMe();
        this.user = user;
        localStorage.setItem('user', JSON.stringify(user));
      } catch {
        this.logout();
      }
    },

    logout() {
      this.token = '';
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
});

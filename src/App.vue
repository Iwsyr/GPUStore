<template>
  <div id="app">
    <router-view></router-view>
    <TabBar :blnShow="router.currentRoute.meta.showTabBar" />
  </div>
</template>

<script>
import TabBar from './components/Bottom/TabBar.vue';
import { useRouter } from 'vue-router';
import { shopStore } from '@/store/shopStore';
import { useAuthStore } from '@/store/authStore';

const TAB_ROUTES = ['/home', '/shop', '/news', '/cart', '/my'];

export default {
  name: 'App',
  data() {
    return {
      router: useRouter(),
      touchStartX: 0,
      touchStartY: 0
    }
  },
  components: {
    TabBar
  },
  mounted() {
    document.addEventListener('touchstart', this.onTouchStart, { capture: true, passive: true });
    document.addEventListener('touchend', this.onTouchEnd, { capture: true, passive: true });
    const shop = shopStore();
    shop.initUserId();
    const auth = useAuthStore();
    if (auth.isLoggedIn) {
      shop.fetchCollects();
      shop.fetchLikes();
      shop.fetchCart();
    }
  },
  unmounted() {
    document.removeEventListener('touchstart', this.onTouchStart, { capture: true });
    document.removeEventListener('touchend', this.onTouchEnd, { capture: true });
  },
  methods: {
    onTouchStart(e) {
      if (!this.router.currentRoute.meta.showTabBar) return;
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
    },
    onTouchEnd(e) {
      if (!this.router.currentRoute.meta.showTabBar) return;

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const diffX = touchEndX - this.touchStartX;
      const diffY = touchEndY - this.touchStartY;

      if (Math.abs(diffX) < 50 || Math.abs(diffX) < Math.abs(diffY)) return;

      const currentPath = this.router.currentRoute.path;
      const currentIndex = TAB_ROUTES.indexOf(currentPath);
      if (currentIndex === -1) return;

      if (diffX > 0 && currentIndex > 0) {
        this.$router.push(TAB_ROUTES[currentIndex - 1]);
      } else if (diffX < 0 && currentIndex < TAB_ROUTES.length - 1) {
        this.$router.push(TAB_ROUTES[currentIndex + 1]);
      }
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

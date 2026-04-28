<template>
  <div id="app">
    <router-view></router-view>
    <TabBar :blnShow="router.currentRoute.meta.showTabBar" />
  </div>
</template>

<script>
import TabBar from './components/Bottom/TabBar.vue';
import { useRouter } from 'vue-router';

export default {
  name: 'App',
  data() {
    return {
      router:useRouter()
    }
  },
  components: {
    TabBar
  },
  methods: {
    // switchTab(index) {
    //   const routes = ['/home', '/shop', '/cart', '/profile']
    //   this.$router.push(routes[index])
    // }
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

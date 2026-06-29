<template>
  <div class="home">
    <TopLogo />
    <Swiper />
    <CategoryNav />
    <Ad />
    <Product />
  </div>
</template>

<script>
import Swiper from '../Home/Swiper.vue'
import CategoryNav from '../Home/CategoryNav.vue'
import Ad from './Ad.vue'
import Product from './Product.vue'
import TopLogo from './Tlogo.vue'

export default {
  name: 'HomePage',
  components: {
    TopLogo,
    Swiper,
    CategoryNav,
    Ad,
    Product
  }
}
</script>

<style scoped>
.home {
  padding-bottom: 0px;
}
</style>
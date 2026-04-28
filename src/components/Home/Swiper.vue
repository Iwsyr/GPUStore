<template>
  <van-swipe class="swiper" :autoplay="3000">
    <van-swipe-item v-for="(image, index) in images" :key="index">
      <img :src="image" />
    </van-swipe-item>
  </van-swipe>
</template>

<script>
import { Swipe, SwipeItem } from 'vant';

export default {
  name: 'HomeSwiper',
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem
  },
  data() {
    return {
      images: [
        require('@/assets/Swiper/1.jpg'),
        require('@/assets/Swiper/2.jpg'),
        require('@/assets/Swiper/3.jpg'),
        require('@/assets/Swiper/4.jpg')
      ]
    }
  }
}
</script>

<style scoped>
.swiper {
  height: 150px;
  margin: 10px;
  border-radius: 5px;
}
.swiper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
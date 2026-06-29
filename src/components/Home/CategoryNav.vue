<template>
  <van-row class="nav-row">
      <van-col :span="6" class="nav-col" v-for="item,key in imgs" :key="key">
          <a :href="item.url">
              <van-image class="nav-img" :src="item.src" fit="cover"/>
              <div class="nav-title">{{ item.title }}</div>
          </a>
      </van-col>
  </van-row>
</template>
<script>
  import imgs50 from "@/assets/Cate/50.jpg";
  import imgs40 from "@/assets/Cate/40.jpg";
  import imgs30 from "@/assets/Cate/30.jpg";
  import imgsaccessories from "@/assets/Cate/accessories.jpg";
  export default {
    name: "HomeCategoryNav",
    data() {
      return {
        imgs: [
            {src: imgs50, url: "/shop", title: "RTX50系列"},
            {src: imgs40, url: "/shop", title: "RTX40系列"},
            {src: imgs30, url: "/shop", title: "RTX30系列"},
            {src: imgsaccessories, url: "/shop", title: "显卡配件"},
        ]
      }
    }
  }
</script>
<style scoped>
  .nav-row {
      padding: 10px 0;
      border-bottom: 1px solid #eee;
  }
  .nav-col {
      text-align: center;
  }
  .nav-img {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      object-fit: cover;
  }
  .nav-title {
      margin-top: 5px;
      font-size: 14px;
      color: #333;
  }
</style>
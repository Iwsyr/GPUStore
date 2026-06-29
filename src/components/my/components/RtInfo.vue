<template>
   <div class="my-info" :style="{ backgroundImage: 'url(' + backgroundImage + ')' }">
     <img :src="defheader" alt="用户头像">
     <span>{{ userInfo.name }}</span>
     <p>{{ userInfo.desc }}</p>
   </div>
</template>

<script>
import defheader from '@/assets/Mylogo.png';
import backgroundImage from '@/assets/Bk.png';
import { mapState } from 'pinia';
import { shopStore } from '@/store/shopStore';

export default {
   data() {
     return {
       defheader: defheader,
       backgroundImage: backgroundImage
     };
   },
   computed: {
     ...mapState(shopStore, ['userInfo'])
   }
};
</script>

<style scoped>
.my-info {
   width: 100%;
   height: 187px;
   background-size: cover;
   background-position: center;
   display: flex;
   justify-content: center;
   align-items: center;
   flex-direction: column;
}

.my-info img {
   width: 86px;
   height: 86px;
   border-radius: 50%;
   margin: 10px 0;
}

.my-info span {
   color: #ffffff;
   font-size: 15px;
}

.my-info p {
   font-size: 12px;
   color: #ffffff;
}
</style>
<template>
    <div>
        <van-nav-bar class="title" title="动态" />
        <van-grid :column-num="1" class="news-grid" :center="false">
            <van-grid-item v-for="item, key in news" :key="key" class="news-item"
                @click="onNavTo(item.id)">
                <h3>{{ item.title }}</h3>
                <van-image :src="require(`@/assets/Swiper/${parseInt(item.id)}.jpg`)" />
                <p>{{ item.desc }}</p>
                <div class="date">发布日期: {{ item.date }}</div>
            </van-grid-item>
        </van-grid>
    </div>
</template>

<script>
import { newsAPI } from '@/services/api';
export default {
    data() {
        return {
            news: []
        }
    },
    async mounted() {
        try {
            this.news = await newsAPI.getNews();
        } catch (error) {
            console.error('获取新闻失败:', error);
        }
    },
    methods: {
        onNavTo(id) {
            this.$router.push({
                path: '/disp',
                query: { id: id }
            })
        }
    }
}
</script>

<style scoped>
.title {
  background: linear-gradient(90deg, #4A1414, #8B4513, #EDEDED);
}

.title >>> .van-nav-bar__title {
  font-size: 18px; /* 字体大小 */
  font-weight: bold; /* 字体粗细 */
  color: #ffffff; /* 字体颜色 */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5); /* 文字阴影 */
  letter-spacing: 1px; /* 字间距 */
}

.news-grid {
    margin-bottom: 50px;
}

.news-item h3 {
    font-size: 16px;
    padding-bottom: 5px;
    margin: -8px 0 5px 0;
}

.news-item p {
    font-size: 12px;
    color: #696969;
    margin: 5px 0;
    line-height: 18px;
}

.news-item .date {
    font-size: 13px;
    color: #696969;
    margin-top: 5px;
}

</style>
<template>
    <div>
        <van-nav-bar title="新闻详情" left-text="返回" left-arrow @click-left="onClickLeft" />
        <div v-if="curNews.length > 0" class="disp" v-html="curNews[0].detail"></div>
        <div v-else style="text-align:center;padding:40px 0;color:#999;">加载中...</div>
        <RtAction v-if="curNews.length > 0" :id="id" :newsData="curNews[0]" />
    </div>
</template>

<script>
import { newsAPI } from '@/services/api'
import RtAction from './RtAction.vue'

export default {
    components: {
        RtAction
    },
    data() {
        return {
            id: this.$route.query.id,
            curNews: []
        };
    },
    async mounted() {
        try {
            const detail = await newsAPI.getNewsDetail(this.id);
            this.curNews = [detail];
        } catch (error) {
            console.error('获取新闻详情失败:', error);
        }
    },
    methods: {
        onClickLeft() {
            this.$router.push('/news');
        }
    }
};
</script>

<style scoped>
.disp {
    padding: 10px 15px;
    line-height: 23px;
    margin-bottom: 75px;
}
</style>
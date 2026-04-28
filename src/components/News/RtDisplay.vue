<template>
    <div>
        <van-nav-bar title="新闻详情" left-text="返回" left-arrow @click-left="onClickLeft" />
        <div class="disp" v-html="curNews[0].detail"></div>
        <RtAction :id="id" :newsData="curNews[0]" />  <!-- 添加底部操作栏 -->
    </div>
</template>

<script>
import data from '@/components/Shop/shop.js'
import RtAction from './RtAction.vue'  // 导入组件

export default {
    components: {
        RtAction  // 注册组件
    },
    data() {
        return {
            id: this.$route.query.id,
            curNews: data.news.filter(item => item.id == this.$route.query.id)
        };
    },
    methods: {
        onClickLeft() {
            history.back();
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
<template>
    <van-nav-bar title="产品详细" left-text="返回" left-arrow @click-left="onClickLeft" />
    <Swipe :id="id"/>
    <Info :id="id"/>
    <Tabs :id="id"/>
    <Action :id="id"/>
</template>
<script>
import Swipe from './components/PSwipe.vue';
import Info from './components/PInfo.vue';
import Tabs from './components/PTabs.vue';
import Action from './components/PAction.vue';
export default {
    name: "ProductInfo",
    data() {
        return {
            id: parseInt(this.$route.query.id),
        }
    },
    components: {
        Swipe,
        Info,
        Tabs,
        Action
    },
    methods: {
        onClickLeft() {
            history.back();
        }
    },
}
</script>
<style scoped></style>
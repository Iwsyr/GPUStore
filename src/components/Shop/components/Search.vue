<template>
    <van-search class="search" v-model="searchkey" @input="onInputSearch" placeholder="请输入显卡型号" shape="round"
    clearable/>
</template>
<script>
export default {
    name: 'CartSearch',
    data() {
        return {
            searchkey: ""
        }
    },
    methods: {
        onInputSearch() {
            this.$emit("onInputSearch", this.searchkey)
        }
    }
}
</script>
<style scoped>
    .search {
        background: linear-gradient(90deg, #4A1414, #8B4513, #EDEDED);
    }
</style>
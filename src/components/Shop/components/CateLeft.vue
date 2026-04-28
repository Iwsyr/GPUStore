<template>
    <van-sidebar v-model="active" @change="onChange">
        <van-sidebar-item :title="item.name" v-for="item,key in items" :key="key" />
    </van-sidebar>
</template>
<script>
export default {
    data(){
        return{
            active: 0
        }
    },
    methods:{
        onChange(idx){
            this.$emit("onChange",idx)
        }
    },
    props:["items"]
}
</script>
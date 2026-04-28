<template>
    <van-grid :column-num="2" class="prod-grid">
        <van-grid-item 
            v-for="(item, key) in prods"
            :key="key" 
            @click="enter(item.id)"
            class="prod-item">
            <van-image :src="item.src"/>
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
            <div class="price">&yen;{{ item.price }}</div>
        </van-grid-item>
    </van-grid>
</template>

<script>
import data from "@/components/Shop/shop.js"

export default {
    name:'HomeProduct',
    data() {
        return {
            prods: data.prods
        }
    },
    methods: {
        enter(id) {
            this.$router.push({
                path: '/product',
                query: { id: id }
            })
        }
    }
}
</script>

<style scoped>
.prod-grid {
    margin-bottom: 50px;
}
.prod-item h3 {
    font-size: 15px;
    margin: 5px 0;
}
.prod-item p {
    font-size: 13px;
    color: #ccc;
    margin-bottom: 5px;
}
.prod-item .price {
    font-size: 14px;
    color: red;
}
</style>
<template>
    <van-nav-bar title="收货地址" left-text="返回" left-arrow @click-left="onClickLeft" />
    <van-address-list v-model="chosenAddressId" :list="addressInfo" default-tag-text="默认" @add="onAdd" @edit="onEdit" />
</template>
<script>
import { mapState } from 'pinia'
import { shopStore } from "@/store/shopStore"
export default {
    data() {
        return {
            chosenAddressId: "1",
        }
    },
    computed: {
        ...mapState(shopStore, ["addressInfo"]),
    },
    methods: {
        onAdd() {
            if (this.$route.query.source) {
                this.$router.push("/addressedit?source=pay");
            } else {
                this.$router.push("/addressedit")
            }
        },
        onEdit(item, index) {
            console.log(item, index)
            this.$router.push({
                path: "/addressedit",
                query: { index: index }
            })
        },
        onClickLeft() {
            history.back();
        }
    }
}
</script>
<style scoped></style>
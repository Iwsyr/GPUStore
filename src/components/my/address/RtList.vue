<template>
    <van-nav-bar title="收货地址" left-text="返回" left-arrow @click-left="onClickLeft" />
    <van-address-list v-model="chosenAddressId" :list="addressInfo" default-tag-text="默认" @add="onAdd" @edit="onEdit" @select="onSelect" />
</template>
<script>
import { mapState, mapActions } from 'pinia'
import { shopStore } from "@/store/shopStore"
export default {
    data() {
        return {
            chosenAddressId: localStorage.getItem('chosenAddressId') || "",
        }
    },
    computed: {
        ...mapState(shopStore, ["addressInfo"]),
    },
    async mounted() {
        await this.fetchAddresses();
        if (!this.chosenAddressId && this.addressInfo.length > 0) {
            const defaultAddr = this.addressInfo.find(a => a.isDefault);
            this.chosenAddressId = defaultAddr ? defaultAddr.id : this.addressInfo[0].id;
        }
    },
    methods: {
        ...mapActions(shopStore, ["fetchAddresses"]),
        onAdd() {
            if (this.$route.query.source) {
                this.$router.push("/addressedit?source=pay");
            } else {
                this.$router.push("/addressedit")
            }
        },
        onEdit(item, index) {
            this.$router.push({
                path: "/addressedit",
                query: { index: index }
            })
        },
        onSelect(item) {
            localStorage.setItem('chosenAddressId', item.id);
            if (this.$route.query.source === 'pay') {
                this.$router.push('/pay');
            }
        },
        onClickLeft() {
            if (this.$route.query.source === 'pay') {
                this.$router.push('/pay');
            } else {
                this.$router.push('/my');
            }
        }
    }
}
</script>
<style scoped></style>
<template>
    <van-nav-bar :title="!blnEdit ? '新增地址' : '编辑地址'" left-text="返回" left-arrow @click-left="onClickLeft" />
    <van-address-edit :address-info="editaddressinfo" :area-list="areaList" :show-delete="index != -1" show-set-default
        show-search-result :search-result="searchResult" :area-columns-placeholder="['请选择', '请选择', '请选择']" @save="onSave"
        @delete="onDelete" @change-detail="onChangeDetail" />
</template>
<script>
import { areaList } from '@vant/area-data';
import { mapState, mapActions } from 'pinia'
import { shopStore } from "@/store/shopStore"
export default {
    data() {
        return {
            searchResult: [],
            areaList: areaList,
            editaddressinfo: {},
            blnEdit: false,
            index: -1
        }
    },
    computed: {
        ...mapState(shopStore, ["addressInfo"]),
    },
    mounted() {
        if (this.$route.query.index) {
            this.index = this.$route.query.index;
            this.editaddressinfo = this.addressInfo[this.index];
            this.blnEdit = true;
        }
    },
    methods: {
        ...mapActions(shopStore, ["add_addressInfo_act", "edit_addressInfo_act", "delete_addressInfo_act"]),
        onSave(info) {
            if (!this.blnEdit) {
                this.add_addressInfo_act(info);
            } else {
                this.edit_addressInfo_act(this.index, info);
            }
            if (this.$route.query.source) {
                this.$router.push("/pay")
            } else {
                this.$router.push("/addresslist")
            }
        },
        onDelete() {
            this.delete_addressInfo_act(this.index);
            this.$router.push("/addresslist")
        },
        onChangeDetail(val) {
            if (val) {
                this.searchResult = [
                    {
                        name: '西二旗万科中心',
                        address: '北京市海淀区',
                    },
                ];
            } else {
                this.searchResult = [];
            }
        },
        onClickLeft() {
            history.back();
        }
    }
}
</script>
<style scoped></style>
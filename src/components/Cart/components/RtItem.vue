<template>
    <div class="item">
        <van-checkbox :name="item.id"></van-checkbox>
        <van-image width="100" height="100" :src="item.img" />
        <div class="info">
            <div class="title">
                <h3>{{item.title}}</h3>
                <p class="price">{{item.price}}</p>
                <p class="btns">
                    <van-button icon="minus" size="mini" @click="editNum(item, 'reduce')" />
                    <span class="num">{{ item.num }}</span>
                    <van-button icon="plus" size="mini" @click="editNum(item, 'add')" />
                </p>
            </div>
            <div class="dele">
                <van-icon name="delete-o" size="23" @click="deleCart(item.id)" />
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions } from 'pinia'
import { shopStore } from "@/store/shopStore"
import { showConfirmDialog } from 'vant';
export default {
    props: ["item"],
    emits: ["sendUpdate"],
    methods: {
        ...mapActions(shopStore, ["edit_carts_num_act", "delete_carts_act"]),
        editNum(data, type) {
            this.edit_carts_num_act(data, type);
            // 通知父级更新
            this.$emit("sendUpdate");
        },
        deleCart(id) {
            showConfirmDialog({
                title: '标题',
                message: '确定要删除选中的记录吗？',
            }).then(() => {
                this.delete_carts_act(id);
                // 通知父级更新
                this.$emit("sendUpdate");
            })
        }
    }
}
</script>
<style>
.item {
    padding: 15px 10px;
    border-bottom: solid 1px #ccc;
    display: flex;
    align-items: center;
}

.item .van-checkbox__icon {
    margin-right: 10px;
}

.info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    line-height: 25px;
    color: #515151;
    margin-left: 5px;
}

.info .title h3 {
    font-size: 16px;
}

.info .title .price {
    font-size: 13px;
    color: red;
}

.info .title .btns {
    display: flex;
    align-items: center;
}

.info .title .btns .num {
    padding: 2px 12px;
    font-size: 12px;
}
</style>
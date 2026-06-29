<template>
    <van-nav-bar title="结算中心" left-text="返回" left-arrow @click-left="onClickLeft" />
    <div v-if="addressInfo.length > 0" class="address" @click="showAddressPicker = true">
        <div class="addr-title">
            <span>{{ currentAddress.name }}</span>
            <span>{{ currentAddress.tel }}</span>
            <van-icon name="arrow-down" class="addr-arrow" />
        </div>
        <div class="addr-info">{{ currentAddress.address }}</div>
    </div>
    <div v-else class="address" style="color:#999;" @click="goAddAddress">
        <div class="addr-title">请先添加收货地址 <van-icon name="arrow" /></div>
    </div>

    <van-action-sheet v-model:show="showAddressPicker" title="选择收货地址">
        <div class="addr-picker-list">
            <div v-for="item in addressInfo" :key="item.id"
                class="addr-picker-item"
                :class="{ 'addr-picker-item-active': item.id === chosenAddressId }"
                @click="selectAddress(item)">
                <div class="addr-picker-title">
                    <span>{{ item.name }}</span>
                    <span>{{ item.tel }}</span>
                    <van-tag v-if="item.isDefault" type="danger" size="small" style="margin-left:6px;">默认</van-tag>
                </div>
                <div class="addr-picker-detail">{{ item.address }}</div>
            </div>
            <div class="addr-picker-add" @click="goAddAddress">
                <van-icon name="plus" /> 新增地址
            </div>
        </div>
    </van-action-sheet>

    <div v-if="orderId" class="pay-item order-info">
        <div class="title">订单信息</div>
        <div class="order-detail">
            <div class="order-row"><span>订单号:</span> {{ orderId }}</div>
            <div class="order-row"><span>状态:</span> 待付款</div>
        </div>
    </div>
    <div class="pay-item">
        <div class="title">商品清单</div>
        <van-card v-for="item, key in payProd" :key="key" :num="item.num" :price="item.price" desc="描述信息"
            :title="item.title" :thumb="item.image" />
    </div>
    <div class="pay-item">
        <div class="title">订单留言</div>
        <van-cell-group inset>
            <van-field v-model="message" style="margin-top:10px;border:solid 1px #eee" rows="3" autosize type="textarea"
                maxlength="50" placeholder="请输入留言" show-word-limit />
        </van-cell-group>
    </div>
    <van-submit-bar :price="sumPrice * 100" button-text="立即结算" @submit="onSubmit">
    </van-submit-bar>
</template>
<script>
import { shopStore } from "@/store/shopStore"
import { orderAPI } from '@/services/api'
import { showToast } from 'vant';

export default {
    data() {
        return {
            message: "",
            chosenAddressId: localStorage.getItem('chosenAddressId') || "",
            showAddressPicker: false,
            submitting: false,
            orderId: null,
            orderData: null,
            loadingOrder: false
        }
    },
    async mounted() {
        this.initChosenAddress();
        // 检查是否有 orderId 参数（从"立即购买"或"提交订单"进入）
        const queryOrderId = this.$route.query.orderId;
        if (queryOrderId) {
            this.orderId = queryOrderId;
            await this.loadOrderDetail(queryOrderId);
        }
    },
    computed: {
        payProd() {
            // 如果有订单数据，展示订单中的商品
            if (this.orderData && this.orderData.items) {
                return this.orderData.items.map(item => ({
                    product_id: item.product_id,
                    title: item.product_name,
                    price: item.price,
                    num: item.quantity,
                    image: item.image_url
                }));
            }
            // 否则兼容旧逻辑：展示购物车中 checked 的商品
            return shopStore().carts.filter(item => item.checked == true);
        },
        sumPrice() {
            let total = 0;
            const items = this.payProd;
            items.forEach(item => {
                total += (Number(item.num) || 0) * (Number(item.price) || 0);
            });
            return total;
        },
        addressInfo() {
            return shopStore().addressInfo;
        },
        carts() {
            return shopStore().carts;
        },
        currentAddress() {
            const addr = this.addressInfo.find(a => a.id === this.chosenAddressId);
            return addr || this.addressInfo[0] || {};
        }
    },
    methods: {
        initChosenAddress() {
            if (!this.chosenAddressId && this.addressInfo.length > 0) {
                const defaultAddr = this.addressInfo.find(a => a.isDefault);
                this.chosenAddressId = defaultAddr ? defaultAddr.id : this.addressInfo[0].id;
                localStorage.setItem('chosenAddressId', this.chosenAddressId);
            }
        },
        selectAddress(item) {
            this.chosenAddressId = item.id;
            localStorage.setItem('chosenAddressId', item.id);
            this.showAddressPicker = false;
        },
        goAddAddress() {
            this.$router.push('/addressedit?source=pay');
        },
        onClickLeft() {
            this.$router.push('/cart');
        },
        async loadOrderDetail(id) {
            this.loadingOrder = true;
            try {
                const order = await orderAPI.getOrder(id);
                this.orderData = order;
            } catch (error) {
                showToast('加载订单失败');
            } finally {
                this.loadingOrder = false;
            }
        },
        async onSubmit() {
            if (this.submitting) return;

            // 如果有 orderId，走"支付已有订单"流程
            if (this.orderId) {
                this.submitting = true;
                try {
                    // 调用后端修改订单状态为 shipped（待收货）
                    await orderAPI.updateOrderStatus(this.orderId, 'shipped');
                    // 跳转到支付成功页，携带订单 ID
                    this.$router.push({ path: '/paysuccess', query: { orderId: this.orderId } });
                } catch (error) {
                    const msg = error.response?.data?.message || '支付失败，请稍后重试';
                    showToast(msg);
                } finally {
                    this.submitting = false;
                }
                return;
            }

            // 如果没有 orderId，走原来的"从购物车创建订单"兼容逻辑
            const payProds = this.carts.filter(item => item.checked);
            if (payProds.length === 0 || this.sumPrice <= 0) {
                showToast('请选择要购买的商品');
                return;
            }
            if (!this.currentAddress || !this.currentAddress.id) {
                showToast('请先选择收货地址');
                return;
            }

            const insufficientItems = payProds.filter(item => item.stock !== undefined && item.num > item.stock);
            if (insufficientItems.length > 0) {
                const names = insufficientItems.map(i => i.title).join('、');
                showToast(`${names} 库存不足，请调整数量`);
                return;
            }

            this.submitting = true;
            const store = shopStore();
            try {
                await store.createOrderAPI({
                    totalPrice: this.sumPrice,
                    items: payProds.map(item => ({
                        product_id: item.product_id,
                        title: item.title,
                        price: item.price,
                        quantity: item.num,
                        image_url: item.image || item.img || ''
                    }))
                });
                this.$router.push("/paysuccess");
            } catch (error) {
                const msg = error.response?.data?.message || '订单提交失败，请稍后重试';
                showToast(msg);
            } finally {
                this.submitting = false;
            }
        }
    }
}
</script>
<style scoped>
.address {
    color: #515155;
    padding: 16px 20px;
    line-height: 23px;
    background: url('~@/assets/bg-addr-box-line.png') #fff left bottom repeat-x;
    background-size: 50px;
    margin-bottom: 10px;
    cursor: pointer;
}

.address .addr-title {
    font-size: 18px;
}

.address .addr-title span {
    margin-right: 10px;
}

.address .addr-arrow {
    float: right;
    margin-top: 4px;
    color: #999;
}

.address .addr-info {
    color: #717171;
    font-size: 15px;
}

.pay-item .title {
    padding: 16px 20px;
    border-bottom: solid 1px #eee;
}

.addr-picker-list {
    max-height: 400px;
    overflow-y: auto;
    padding: 0 16px 20px;
}

.addr-picker-item {
    padding: 14px 12px;
    border-bottom: 1px solid #f0f0f0;
    border-radius: 8px;
    margin-bottom: 8px;
    transition: all 0.2s;
}

.addr-picker-item-active {
    background: linear-gradient(135deg, #fff5f5, #fff0f0);
    border: 1px solid #ff4444;
}

.addr-picker-title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 4px;
}

.addr-picker-title span {
    margin-right: 10px;
}

.addr-picker-detail {
    font-size: 13px;
    color: #999;
}

.addr-picker-add {
    text-align: center;
    padding: 14px;
    color: #1989fa;
    font-size: 15px;
    cursor: pointer;
}
</style>
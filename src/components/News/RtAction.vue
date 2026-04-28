<template>
    <div class="action">
        <van-button @click="toggleLike(id)" :icon="retNewsLikes && retNewsLikes.length > 0 ? 'good-job' : 'good-job-o'" plain round size="small" hairline type="primary">
            {{ retNewsLikes ? retNewsLikes.length : 0 }}
        </van-button>
        <van-button @click="toggleCollect({ 'id': id, 'type': 2 })" :icon="retBlnCollected ? 'like' : 'like-o'" plain round size="small" hairline type="primary">
            {{ retBlnCollected ? '已收藏' : '收藏' }}
        </van-button>
    </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { shopStore } from '@/store/shopStore';

export default {
    props: ['id', 'newsData'], // Add newsData prop
    setup() {
        const store = shopStore();
        return { store };
    },
    methods: {
        ...mapActions(shopStore, ['add_collect_act', 'add_like_act', 'del_collect_act', 'remove_like_act']),
        toggleLike(id) {
            if (this.retNewsLikes && this.retNewsLikes.length > 0) {
                this.remove_like_act(id);
            } else {
                this.add_like_act(id);
            }
        },
        toggleCollect(item) {
            if (this.retBlnCollected) {
                this.del_collect_act(item.id);
            } else {
                const newsItem = this.newsData || this.curNews?.[0];
                if (!newsItem) return;
                
                this.add_collect_act({
                    id: newsItem.id || this.id,
                    type: 2,
                    title: newsItem.title || '无标题',
                    desc: newsItem.desc || '无描述'
                });
            }
        }
    },
    computed: {
        ...mapState(shopStore, ['collects', 'likes']),
        retBlnCollected() {
            return this.collects.filter(item => item.id == this.id && item.type == 2).length > 0 ? true : false;
        },
        retNewsLikes() {
            return this.likes.filter(item => item == this.id);
        }
    }
};
</script>

<style scoped>
.action {
    padding: 15px 0;
    display: flex;
    justify-content: space-around;
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 0;
    background-color: #fff;
}

.van-button {
    width: 90px;
}
</style>

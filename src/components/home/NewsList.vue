<template>
  <div class="subBox">
    <div class="subItem-title">
      <span class="keyword" :style="{ color: props.color }">{{ props.keyword }}</span>
      <span> 관련 뉴스</span>
    </div>
    <div class="news-list">
      <NewsListItem
        v-for="(news, index) in filterNews"
        :key="index"
        :title="news.title"
        :date="news.date" />
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';
import NewsListItem from '@/components/home/NewsListItem.vue';
const props = defineProps({
  keyword: String,
  color: String,
  newsList: Array  // 뉴스 목록 데이터, 부모에서 전달
});

const filterNews = computed(() => {
  if (!props.keyword) return props.newsList;
  return props.newsList.filter(item => item.labels.includes(props.keyword));
});
</script>
<style scoped>
.subBox {
  background-color: var(--white);
  border-radius: 8px;
  border: 1px solid var(--main04);
  padding: 20px;
}
.subItem-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semi-bold);
}

.keyword {
  text-decoration: underline;
}

.news-list {
  margin-top: 10px;
}
</style>
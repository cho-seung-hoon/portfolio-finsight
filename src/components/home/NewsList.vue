<template>
  <div class="subBox">
    <div class="subItem-title">
      <span class="keyword">트럼프</span>
      <span> 관련 뉴스</span>
    </div>
    <div class="news-list">
      <NewsListItem
        v-for="(news, index) in newsList"
        :key="index"
        :title="news.title"
        :date="news.date"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import NewsListItem from '@/components/home/NewsListItem.vue';

const newsList = ref([
  {
    title: '트럼프, 새로운 정책 발표',
    date: '2025-07-22'
  },
  {
    title: '트럼프 관련 국제 뉴스',
    date: '2025-07-21'
  },
  // 추가 뉴스 데이터...
]);
</script>
<style scoped>
.subBox{
  background-color: var(--white);
  border-radius: 8px;
  border:1px solid var(--main04);
  padding:20px;
}
.subItem-title{
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semi-bold);
}

.keyword{
  color:var(--text-red);
  text-decoration: underline;
}

.news-list {
  margin-top: 10px;
}

</style>
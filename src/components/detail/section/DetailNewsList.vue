<template>
  <div class="news-list-container">
    <div class="subItem-title">
      <span
        class="keyword"
        :style="{ color: props.color }"
        >{{ props.keyword }}</span
      >
      <span> 관련 뉴스</span>
    </div>

    <div class="news-list">
      <NewsListItem
        v-for="(news, index) in displayedNews"
        :key="news.news_id"
        :title="news.news_title"
        :url="news.news_content_url"
        :sentiment="news.news_sentiment"
        :date="formatDateForNewsItem(news.news_published_at)"
        :news-id="news.news_id" />
    </div>

    <div
      v-if="hasMoreNews"
      class="load-more-container">
      <button
        class="load-more-btn"
        :disabled="isLoading"
        @click="loadMore">
        <span v-if="!isLoading">더보기</span>
        <span
          v-else
          class="loading-text">
          <span class="loading-spinner"></span>
          로딩중...
        </span>
        <span
          v-if="remainingCount < 99"
          class="news-count"
          >(+{{ remainingCount }})</span
        >
        <span
          v-else
          class="news-count"
          >(+99)</span
        >
      </button>
    </div>

    <div
      v-else-if="filterNews.length > 0 && displayedNews.length > 0"
      class="no-more-news">
      모든 뉴스를 확인했습니다
    </div>

    <div
      v-if="filterNews.length === 0"
      class="no-news">
      관련 뉴스가 없습니다
    </div>
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue';
import NewsListItem from '@/components/home/NewsListItem.vue';

const props = defineProps({
  keyword: String,
  color: String,
  newsList: Array
});

const currentPage = ref(1);
const itemsPerPage = 10;
const isLoading = ref(false);

const filterNews = computed(() => {
  return props.newsList || [];
});

const displayedNews = computed(() => {
  const endIndex = currentPage.value * itemsPerPage;
  return filterNews.value.slice(0, endIndex);
});

const hasMoreNews = computed(() => {
  return displayedNews.value.length < filterNews.value.length;
});

const remainingCount = computed(() => {
  return filterNews.value.length - displayedNews.value.length;
});

const loadMore = async () => {
  if (isLoading.value || !hasMoreNews.value) return;

  isLoading.value = true;

  await new Promise(resolve => setTimeout(resolve, 300));

  currentPage.value += 1;
  isLoading.value = false;
};

const resetPagination = () => {
  currentPage.value = 1;
};

watch(
  () => [props.keyword, props.newsList],
  () => {
    resetPagination();
  },
  { deep: true }
);

const formatDateForNewsItem = isoString => {
  if (!isoString) return [];

  const date = new Date(isoString);
  return [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes()
  ];
};
</script>

<style scoped>
.news-list-container {
  width: 100%;
}

.subItem-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semi-bold);
  margin-bottom: 10px;
}

.keyword {
  text-decoration: underline;
}

.news-list {
  margin-top: 10px;
}

.load-more-container {
  margin-top: 16px;
  text-align: center;
}

.load-more-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background-color: var(--white);
  border: 1px solid var(--main04);
  border-radius: 6px;
  color: var(--main01);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.2s ease;
}

.load-more-btn:hover:not(:disabled) {
  background-color: var(--main05);
  border-color: var(--main02);
}

.load-more-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-text {
  display: flex;
  align-items: center;
  gap: 6px;
}

.loading-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid var(--main04);
  border-top: 2px solid var(--main01);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.news-count {
  font-size: var(--font-size-xs);
  color: var(--main02);
  font-weight: normal;
}

.no-more-news {
  text-align: center;
  padding: 16px;
  color: var(--main02);
  font-size: var(--font-size-sm);
  border-top: 1px solid var(--main04);
  margin-top: 12px;
}

.no-news {
  text-align: center;
  padding: 20px;
  color: var(--main02);
  font-size: var(--font-size-sm);
}
</style>

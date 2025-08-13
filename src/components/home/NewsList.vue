<template>
  <div class="subBox">
    <div class="subItem">
      <div class="subItem-title">
        <span
          class="keyword"
          :style="{ color: props.color }"
          >{{ props.keyword }}</span
        >
        <span> 관련 뉴스</span>
      </div>
      <div class="sentiment-filter">
        <button
          :class="{ active: selectedSentiment === 'all' }"
          @click="setSentimentFilter('all')">
          전체
        </button>
        <button
          :class="{ active: selectedSentiment === 'positive' }"
          @click="setSentimentFilter('positive')">
          긍정
        </button>
        <button
          :class="{ active: selectedSentiment === 'neutral' }"
          @click="setSentimentFilter('neutral')">
          중립
        </button>
        <button
          :class="{ active: selectedSentiment === 'negative' }"
          @click="setSentimentFilter('negative')">
          부정
        </button>
      </div>
    </div>

    <div class="news-list">
      <!-- 여기가 핵심: filterNews가 아닌 displayedNews 사용 -->
      <NewsListItem
        v-for="(news, index) in displayedNews"
        :key="index"
        :title="news.newsTitle"
        :url="news.newsContentUrl"
        :sentiment="news.newsSentiment"
        :date="news.newsPublishedAt"
        :publisher="news.newsPublisher"
        :news-id="news.newsId" />
    </div>

    <!-- 더보기 버튼 -->
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

    <!-- 모든 뉴스를 다 본 경우 -->
    <div
      v-else-if="filterNews.length > 0 && displayedNews.length > 0"
      class="no-more-news">
      모든 뉴스를 확인했습니다
    </div>

    <!-- 뉴스가 없는 경우 -->
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
  newsList: Array // 뉴스 목록 데이터, 부모에서 전달
});

const currentPage = ref(1);
const itemsPerPage = 3;
const isLoading = ref(false);

// [추가] 현재 선택된 감성 필터 상태 ('all', '긍정', '중립', '부정')
const selectedSentiment = ref('all');

// [수정] 선택된 감성에 따라 뉴스 목록을 필터링하도록 수정
const filterNews = computed(() => {
  const allNews = props.newsList || [];
  if (selectedSentiment.value === 'all') {
    return allNews;
  }
  return allNews.filter(news => news.newsSentiment === selectedSentiment.value);
});

// 현재 표시할 뉴스 목록 (페이지네이션 적용)
const displayedNews = computed(() => {
  const endIndex = currentPage.value * itemsPerPage;
  return filterNews.value.slice(0, endIndex);
});

// 더 보여줄 뉴스가 있는지 확인
const hasMoreNews = computed(() => {
  return displayedNews.value.length < filterNews.value.length;
});

// 남은 뉴스 개수
const remainingCount = computed(() => {
  return filterNews.value.length - displayedNews.value.length;
});

// 더보기 버튼 클릭 핸들러
const loadMore = async () => {
  if (isLoading.value || !hasMoreNews.value) return;

  isLoading.value = true;

  // 로딩 효과를 위한 약간의 지연
  await new Promise(resolve => setTimeout(resolve, 300));

  currentPage.value += 1;
  isLoading.value = false;
};

// [추가] 감성 필터 변경 시, 필터 상태를 업데이트하고 페이지네이션을 초기화하는 함수
const setSentimentFilter = sentiment => {
  selectedSentiment.value = sentiment;
  currentPage.value = 1; // 필터 변경 시 첫 페이지로 리셋
};

// props가 변경될 때 페이지와 필터를 초기화
const resetPaginationAndFilter = () => {
  currentPage.value = 1;
  selectedSentiment.value = 'all'; // 키워드가 바뀌면 필터도 '전체'로 초기화
};

// keyword나 newsList가 변경될 때 페이지네이션 초기화
watch(
  () => [props.keyword, props.newsList],
  () => {
    resetPaginationAndFilter();
  },
  { deep: true }
);
</script>

<style scoped>
.subBox {
  background-color: var(--white);
  border-radius: 8px;
  border: 1px solid var(--main04);
  padding: 20px;
}

.subItem{
  display:flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.subItem-title {
  display: flex;
  align-items: center;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semi-bold);
  gap: 5px;
}

.keyword {
  text-decoration: underline;
}

.news-list {
  margin-top: 10px;
}

/* 감성 필터 버튼들을 담는 컨테이너 */
.sentiment-filter {
  display: flex;
  gap: 5px; /* 버튼 사이 간격 */
}

/* 감성 필터 개별 버튼 스타일 */
.sentiment-filter button {
  padding: 5px 10px;
  border: 1px solid var(--main04);
  background-color: var(--white);
  color: var(--main02);
  border-radius: 6px; /* 둥근 알약 모양 */
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-light);
  cursor: pointer;
  transition: all 0.2s ease;
}

/* 버튼에 마우스를 올렸을 때 스타일 */
.sentiment-filter button:hover {
  background-color: #f9fafb;
  border-color: var(--main03);
}

/* 현재 선택된(활성화된) 버튼 스타일 */
.sentiment-filter button.active {
  background-color: var(--main01);
  color: var(--white);
  border-color: var(--main01);
  font-weight: var(--font-weight-bold);
}

/* 새로 추가된 스타일 */
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
  background-color: #f9fafb;
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

<template>
  <div class="news-list-container">
    <div class="news-items">
      <div
        v-for="(news, index) in displayedNews"
        :key="news.news_id"
        class="news-item"
        @click="openNewsLink(news.news_content_url)">
        <div class="news-content">
          <div class="news-text">{{ news.news_title }}</div>
          <div class="news-meta">
            <div class="news-time">{{ formatDate(news.news_published_at) }}</div>
            <div class="news-score-container">
              <div class="accuracy-stars">
                <span
                  v-for="star in 5"
                  :key="star"
                  class="star"
                  :class="{ filled: star <= Math.round(news.news_score * 5) }">
                  ★
                </span>
              </div>
              <span class="accuracy-text">{{ (news.news_score * 100).toFixed(0) }}%</span>
            </div>
          </div>
        </div>
        <div
          class="sentiment-badge"
          :class="getSentimentClass(news.news_sentiment)">
          {{ getSentimentText(news.news_sentiment) }}
        </div>
      </div>
    </div>

    <!-- 로딩 스피너 -->
    <div
      v-if="isLoading"
      class="loading-spinner">
      <div class="spinner"></div>
      <span>뉴스를 불러오는 중...</span>
    </div>

    <!-- 더 보기 버튼 -->
    <div
      v-if="hasMoreNews && !isLoading"
      class="load-more">
      <button
        @click="loadMoreNews"
        class="load-more-btn">
        더 보기
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  newsList: {
    type: Array,
    default: () => []
  }
});

// 상태 관리
const currentPage = ref(1);
const itemsPerPage = 10;
const isLoading = ref(false);

// 표시할 뉴스 계산
const displayedNews = computed(() => {
  return props.newsList.slice(0, currentPage.value * itemsPerPage);
});

// 더 많은 뉴스가 있는지 확인
const hasMoreNews = computed(() => {
  return displayedNews.value.length < props.newsList.length;
});

// 감성에 따른 클래스 반환
const getSentimentClass = sentiment => {
  switch (sentiment) {
    case 'positive':
      return 'sentiment-positive';
    case 'negative':
      return 'sentiment-negative';
    case 'neutral':
      return 'sentiment-neutral';
    default:
      return 'sentiment-neutral';
  }
};

// 감성 텍스트 반환
const getSentimentText = sentiment => {
  switch (sentiment) {
    case 'positive':
      return '긍정';
    case 'negative':
      return '부정';
    case 'neutral':
      return '중립';
    default:
      return '중립';
  }
};

// 날짜 포맷팅 (yyyy/mm/dd 형태)
const formatDate = publishedAt => {
  const date = new Date(publishedAt);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

// 뉴스 링크 열기
const openNewsLink = url => {
  if (url) {
    window.open(url, '_blank');
  }
};

// 더 많은 뉴스 로드
const loadMoreNews = async () => {
  if (isLoading.value || !hasMoreNews.value) return;

  isLoading.value = true;

  // 로딩 시뮬레이션 (실제 API 호출 시 제거)
  await new Promise(resolve => setTimeout(resolve, 1000));

  currentPage.value += 1;
  isLoading.value = false;
};

// 무한 스크롤 처리
const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  // 스크롤이 하단에 가까워지면 자동으로 더 로드
  if (scrollTop + windowHeight >= documentHeight - 100) {
    loadMoreNews();
  }
};

// 컴포넌트 마운트 시 스크롤 이벤트 리스너 추가
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

// 컴포넌트 언마운트 시 스크롤 이벤트 리스너 제거
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.news-list-container {
  width: 100%;
}

.news-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.news-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  background: var(--white);
  border-radius: 8px;
  border: 1px solid var(--main03);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.news-item:hover {
  background: #f8f9fa;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.news-content {
  flex: 1;
  margin-right: 12px;
}

.news-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--black);
  line-height: 1.4;
  margin-bottom: 8px;
  text-align: left;
}

.news-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--main02);
}

.news-time {
  text-align: left;
}

.news-score-container {
  display: flex;
  align-items: center;
  gap: 6px;
}

.accuracy-stars {
  display: flex;
  gap: 1px;
}

.star {
  font-size: 12px;
  color: #e0e0e0;
  transition: color 0.2s ease;
}

.star.filled {
  color: #ffc107;
}

.accuracy-text {
  font-size: 11px;
  font-weight: 600;
  color: #6c757d;
  background: #f8f9fa;
  padding: 2px 6px;
  border-radius: 4px;
}

.sentiment-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  min-width: 40px;
  text-align: center;
  align-self: flex-start;
  margin-top: 0;
}

.sentiment-positive {
  background: #e8f5e8;
  color: #2e7d32;
}

.sentiment-negative {
  background: #ffebee;
  color: #d32f2f;
}

.sentiment-neutral {
  background: #fff3e0;
  color: #f57c00;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  color: var(--main02);
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--main03);
  border-top: 2px solid var(--main01);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 8px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.load-more {
  display: flex;
  justify-content: center;
  padding: 16px;
}

.load-more-btn {
  padding: 8px 16px;
  background: var(--main01);
  color: var(--white);
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.load-more-btn:hover {
  background: var(--main02);
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .news-item {
    padding: 12px;
  }

  .news-text {
    font-size: 13px;
  }

  .news-meta {
    font-size: 11px;
  }

  .star {
    font-size: 11px;
  }

  .accuracy-text {
    font-size: 10px;
    padding: 1px 4px;
  }

  .sentiment-badge {
    padding: 3px 6px;
    font-size: 10px;
    min-width: 35px;
  }

  .load-more-btn {
    padding: 6px 12px;
    font-size: 13px;
  }
}
</style>

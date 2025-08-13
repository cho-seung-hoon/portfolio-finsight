<template>
  <div class="home-box">
    <ExchangeRate />
  </div>
  <div class="line"></div>
  <div class="home-box">
    <NewsChart
      :chart-data="chartData"
      @initial-load="handleKeywordClick"
      @keyword-click="handleKeywordClick"
      @refresh-data="handleRefresh" />
  </div>
  <div class="home-box">
    <NewsList
      :keyword="selectKeyword"
      :color="selectColor"
      :news-list="filteredNewsList" />
  </div>
  <div class="home-box">
    <NewsProduct
      :keyword="selectKeyword"
      :color="selectColor"
      :product-list="filteredProductList" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import ExchangeRate from '@/components/home/ExchangeRate.vue';
import NewsChart from '@/components/home/NewsChart.vue';
import NewsList from '@/components/home/NewsList.vue';
import NewsProduct from '@/components/home/NewsProduct.vue';
import { useLoadingStore } from '@/stores/loading';
import { fetchKeywords, fetchNewsByKeyword } from '@/api/newsApi.js';

const loadingStore = useLoadingStore();

const chartData = ref([]);
const newsListForKeyword = ref([]);
const productListForKeyword = ref([]);
const selectKeyword = ref(null);
const selectColor = ref(null);

// ▼▼▼ 1. 페이지 전체를 초기화하는 새로운 함수 ▼▼▼
async function initializePage() {
  // 로딩 메시지는 스토어의 기본값을 사용하거나 여기서 설정할 수 있습니다.
  // 스토어의 카운터가 모든 요청을 관리해줍니다.

  // 첫 번째 API 호출 (키워드 목록)
  const keywordsData = await fetchAndSetKeywords();

  // 첫 번째 API 호출의 결과가 있을 경우에만 두 번째 호출 실행
  if (keywordsData && keywordsData.length > 0) {
    const initialKeyword = keywordsData[0];

    // 두 번째 API 호출 (첫 키워드의 뉴스/상품 목록)
    // handleKeywordClick을 호출하여 상태 업데이트와 데이터 로드를 동시에 처리
    await handleKeywordClick({
      id: initialKeyword.id,
      label: initialKeyword.label,
      color: '#CCCCCC' // 초기 색상은 알 수 없으므로 기본값 설정
    });
  }
}

// 사용자가 키워드를 클릭했을 때 호출되는 함수
async function handleKeywordClick(payload) {
  selectKeyword.value = payload.label;
  selectColor.value = payload.color;
  await loadNewsAndProductsByKeyword(payload.id);
}

// 뉴스/상품 목록을 불러오는 함수 (로딩 로직 포함)
async function loadNewsAndProductsByKeyword(keywordId) {
  loadingStore.startLoading('목록을 불러오는 중...'); // 카운터 +1
  try {
    const responseData = await fetchNewsByKeyword(keywordId);
    if (responseData) {
      newsListForKeyword.value = responseData.newsList || [];
      productListForKeyword.value = responseData.productList || [];
    } else {
      // ...
    }
  } catch (error) {
    console.error('Error loading news data by keyword:', error);
    // ...
  } finally {
    loadingStore.stopLoading(); // 카운터 -1
  }
}

const filteredNewsList = computed(() => newsListForKeyword.value);
const filteredProductList = computed(() => productListForKeyword.value);


// ▼▼▼ 2. 기존 handleRefresh는 키워드 데이터만 가져오는 역할로 변경 ▼▼▼
async function fetchAndSetKeywords() {
  loadingStore.startLoading('키워드를 불러오는 중...'); // 카운터 +1
  try {
    const apiResponseData = await fetchKeywords();
    const bubbleChartData = apiResponseData.map(item => {
      // ... (기존 차트 데이터 가공 로직은 동일)
      const sentiments = { positive: item.positiveCount * 5, negative: item.negativeCount * 5, neutral: item.neutralCount };
      let dominantSentiment;
      if (sentiments.positive === sentiments.negative) {
        dominantSentiment = 'neutral';
      } else {
        dominantSentiment = Object.keys(sentiments).reduce((a, b) => sentiments[a] > sentiments[b] ? a : b);
      }
      return { id: item.keywordId, label: item.keyword, value: sentiments[dominantSentiment], sentiment: dominantSentiment };
    });
    chartData.value = bubbleChartData;
    return bubbleChartData; // 결과를 반환하여 다음 작업에 사용
  } catch (error) {
    console.error('Error loading initial home data:', error);
    chartData.value = [];
    return null; // 실패 시 null 반환
  } finally {
    loadingStore.stopLoading(); // 카운터 -1
  }
}

// handleRefresh 함수는 사용자가 당겨서 새로고침할 때를 위해 이름을 유지하거나,
// fetchAndSetKeywords로 완전히 대체할 수 있습니다. 여기서는 이름을 유지합니다.
const handleRefresh = fetchAndSetKeywords;

// ▼▼▼ 3. onMounted에서는 통합된 초기화 함수 하나만 호출 ▼▼▼
onMounted(() => {
  initializePage();
});
</script>

<style scoped>
.home-box {
  margin: 10px 0;
}

.line {
  height: 10px;
  background-color: var(--main04);
  margin-left: calc(-1 * 20px);
  margin-right: calc(-1 * 20px);
  width: calc(100% + 40px);
}
</style>

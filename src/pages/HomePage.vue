<template>
  <div class="home-box">
    <ExchangeRate />
  </div>
  <div class="line"></div>
  <div class="home-box">
    <NewsChart
      :chart-data="chartData"
      @initial-load="handleKeywordClick"
      @keyword-click="handleKeywordClick" />
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

async function handleKeywordClick(payload) {
  selectKeyword.value = payload.label;
  selectColor.value = payload.color;
  await loadNewsAndProductsByKeyword(payload.id);

  console.log("payload : " + payload.id);
}

async function loadNewsAndProductsByKeyword(keywordId) {
  loadingStore.startLoading('목록을 불러오는 중...');
  try {
    const responseData = await fetchNewsByKeyword(keywordId);

    console.log('API 응답 데이터 (responseData):', responseData);
    // [수정] responseData가 null이 아닌지 확인하는 로직 추가
    if (responseData) {
      newsListForKeyword.value = responseData.newsList || [];
      productListForKeyword.value = responseData.productList || [];

      console.log("ProductList : " + productListForKeyword.value);
    } else {
      // API 호출이 실패하면 목록을 비웁니다.
      newsListForKeyword.value = [];
      productListForKeyword.value = [];
    }

  } catch (error) {
    // 이 catch는 거의 실행되지 않지만, 만약을 위해 유지합니다.
    console.error('Error loading news data by keyword:', error);
    newsListForKeyword.value = [];
    productListForKeyword.value = [];
  } finally {
    loadingStore.stopLoading();
  }
}
const filteredNewsList = computed(() => newsListForKeyword.value);
const filteredProductList = computed(() => productListForKeyword.value);

onMounted(async () => {
  loadingStore.startLoading('홈 데이터를 불러오는 중...');
  try {
    const apiResponseData = await fetchKeywords();
    const bubbleChartData = apiResponseData.map(item => {
      const sentiments = {
        positive: item.positiveCount,
        negative: item.negativeCount,
        neutral: item.neutralCount
      };
      const dominantSentiment = Object.keys(sentiments).reduce((a, b) =>
        sentiments[a] > sentiments[b] ? a : b
      );
      return {
        id: item.keywordId,
        label: item.keyword,
        value: item.totalCount,
        sentiment: dominantSentiment
      };
    });
    chartData.value = bubbleChartData;
  } catch (error) {
    console.error('Error loading initial home data:', error);
    chartData.value = [];
  } finally {
    loadingStore.stopLoading();
  }
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

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

    if (responseData) {
      newsListForKeyword.value = responseData.newsList || [];
      productListForKeyword.value = responseData.productList || [];
    } else {
      newsListForKeyword.value = [];
      productListForKeyword.value = [];
    }

  } catch (error) {
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
        positive: item.positiveCount * 5 , // 긍정 - 가중치
        negative: item.negativeCount * 5, // 부정 - 가중치
        neutral: item.neutralCount
      };
      let dominantSentiment;

      if (sentiments.positive === sentiments.negative) {
        dominantSentiment = 'neutral';
      } else {
        dominantSentiment = Object.keys(sentiments).reduce((a, b) =>
          sentiments[a] > sentiments[b] ? a : b
        );
      }

      return {
        id: item.keywordId,
        label: item.keyword,
        value: sentiments[dominantSentiment],
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

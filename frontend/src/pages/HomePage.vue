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
      :fund-list="filteredFundList"
      :etf-list="filteredEtfList" />
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
const etfListForKeyword = ref([]);
const fundListForKeyword = ref([]);
const selectKeyword = ref(null);
const selectColor = ref(null);


async function initializePage() {
  await fetchAndSetKeywords();
}

async function handleKeywordClick(payload) {
  selectKeyword.value = payload.label;
  selectColor.value = payload.color;
  await loadNewsAndProductsByKeyword(payload.id);
}

async function loadNewsAndProductsByKeyword(keywordId) {
  loadingStore.startLoading('목록을 불러오는 중...');
  try {
    const responseData = await fetchNewsByKeyword(keywordId);
    if (responseData) {
      console.log("responseData", responseData);
      newsListForKeyword.value = responseData.newsList || [];
      etfListForKeyword.value = responseData.etfList || [];
      fundListForKeyword.value = responseData.fundList || [];
    }
  } catch (error) {
    console.error('Error loading news data by keyword:', error);

  } finally {
    loadingStore.stopLoading();
  }
}

const filteredNewsList = computed(() => newsListForKeyword.value);
const filteredEtfList = computed(() => etfListForKeyword.value);
const filteredFundList = computed(() => fundListForKeyword.value);

async function fetchAndSetKeywords() {
  loadingStore.startLoading('키워드를 불러오는 중...'); // 카운터 +1
  try {
    const apiResponseData = await fetchKeywords();
    console.log("apiResponseData", apiResponseData);
    const bubbleChartData = apiResponseData.map(item => {
      const sentiments = { POSITIVE: item.positiveCount * 5, NEGATIVE: item.negativeCount * 5, NEUTRAL: item.neutralCount };
      let dominantSentiment;
      if (sentiments.POSITIVE === sentiments.NEGATIVE) {
        dominantSentiment = 'NEUTRAL';
      } else {
        dominantSentiment = Object.keys(sentiments).reduce((a, b) => sentiments[a] > sentiments[b] ? a : b);
      }
      return { id: item.keywordId, label: item.keyword, value: sentiments[dominantSentiment], sentiment: dominantSentiment };
    });
    chartData.value = bubbleChartData;
    return bubbleChartData;
  } catch (error) {
    console.error('Error loading initial home data:', error);
    chartData.value = [];
    return null;
  } finally {
    loadingStore.stopLoading();
  }
}


const handleRefresh = fetchAndSetKeywords;

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

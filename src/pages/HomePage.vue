<template>
  <div class="home-box">
    <ExchangeRate />
  </div>
  <div class="home-box">
    <MiniMy />
  </div>
  <div class="line"></div>
  <div class="home-box">
    <NewsChart
      :chart-data="chartData"
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
import { useHeaderStore } from '@/stores/header';
import { onBeforeRouteLeave } from 'vue-router';
import ExchangeRate from '@/components/home/ExchangeRate.vue';
import MiniMy from '@/components/home/MiniMy.vue';
import NewsChart from '@/components/home/NewsChart.vue';
import NewsList from '@/components/home/NewsList.vue';
import NewsProduct from '@/components/home/NewsProduct.vue';

const headerStore = useHeaderStore();
const chartData = ref([]);
const allNews = ref([]);
const allProducts = ref([]);
const selectKeyword = ref(null);
const selectColor = ref(null);

function handleKeywordClick(payload) {
  selectKeyword.value = payload.label;
  selectColor.value = payload.color;
}

const rawNewsData = [
  {
    id: 1,
    title: '미국 금리 인상 가능성에 시장 출렁',
    summary:
      '연준의 금리 인상 가능성 시사에 따라 시장의 변동성이 커지고 있습니다. 투자자들의 주의가 요구됩니다.',
    content_url: 'https://example.com/news/1',
    published_at: '2025-07-24',
    labels: ['금리', '미국 증시'],
    sentiment: 'negative'
  },
  {
    id: 2,
    title: 'FOMC, "인플레이션 아직 높아"... 매파적 발언',
    summary:
      '지난밤 열린 FOMC 회의에서 인플레이션에 대한 강한 경계심을 드러내며 추가 긴축 가능성을 열어두었습니다.',
    content_url: 'https://example.com/news/2',
    published_at: '2025-07-24',
    labels: ['FOMC', '인플레이션', '금리'],
    sentiment: 'negative'
  },
  {
    id: 3,
    title: '엔비디아, 예상을 뛰어넘는 실적 발표',
    summary:
      'AI 칩 수요 폭발에 힘입어 엔비디아가 시장 예상치를 크게 상회하는 분기 실적을 발표했습니다.',
    content_url: 'https://example.com/news/3',
    published_at: '2025-07-23',
    labels: ['엔비디아', '반도체', '미국 증시'],
    sentiment: 'positive'
  },
  {
    id: 4,
    title: '테슬라, 신형 전기차 모델 공개 임박',
    summary:
      '테슬라가 곧 보급형 신규 전기차 모델을 공개할 것이라는 소식에 주가가 상승세를 보이고 있습니다.',
    content_url: 'https://example.com/news/4',
    published_at: '2025-07-23',
    labels: ['테슬라', '전기차'],
    sentiment: 'positive'
  },
  {
    id: 5,
    title: '정부, 반도체 산업 지원 확대 방안 발표',
    summary:
      '정부가 시스템 반도체 경쟁력 강화를 위해 대규모 세제 혜택 및 R&D 지원을 포함한 종합 대책을 발표했습니다.',
    content_url: 'https://example.com/news/5',
    published_at: '2025-07-22',
    labels: ['반도체', '코스피'],
    sentiment: 'positive'
  },
  {
    id: 6,
    title: '환율 안정세, 코스피에 긍정적 영향',
    summary: '원/달러 환율이 하향 안정세를 보이며 외국인 투자자들의 순매수세가 유입되고 있습니다.',
    content_url: 'https://example.com/news/6',
    published_at: '2025-07-22',
    labels: ['환율', '코스피'],
    sentiment: 'neutral'
  }
];
// const rawProductData = [
//   {
//     id: 1,
//     title: '미국 테크 Top10 ETF',
//     category: 'ETF',
//     labels: ['미국 증시', '엔비디아', '테슬라']
//   },
//   { id: 2, title: '글로벌 채권 펀드', category: '펀드', labels: ['채권', '금리'] },
//   { id: 3, title: 'KOSPI 200 인덱스 펀드', category: '펀드', labels: ['코스피'] },
//   { id: 4, title: '차세대 전기차 ETF', category: 'ETF', labels: ['전기차', '테슬라'] },
//   { id: 5, title: '친환경 에너지 솔루션 ETF', category: 'ETF', labels: ['친환경 에너지'] }
// ];
const rawProductData = [
  {
    category: '펀드',
    fund_code: 'FUND123',
    country: '국내',
    fund_type: '주식형',
    product_name: '펀드A',
    rate_of_return: '37.31%',
    risk_grade: 1,
    news_response: '긍정',
    labels: ['채권', '금리']
  },
  {
    category: '펀드',
    fund_code: 'FUND456',
    country: '해외',
    fund_type: '채권형',
    product_name: '펀드B',
    rate_of_return: '12.10%',
    risk_grade: 3,
    news_response: '중립',
    labels: ['친환경 에너지', '코스피']
  },
  {
    category: 'ETF',
    product_code: 'ETF001',
    country: '국내',
    etf_type: '주식형',
    product_name: 'KODEX 200',
    nav: 2000,
    volume: 3000,
    rate_of_return: '3.3% (1개월)',
    risk_grade: 3,
    news_response: '긍정',
    labels: ['전기차', '테슬라']
  },
  {
    category: 'ETF',
    product_code: 'ETF002',
    country: '국내',
    etf_type: '채권형',
    product_name: 'TIGER 국채3년',
    nav: 10250,
    volume: 45700,
    rate_of_return: '1.1% (1개월)',
    risk_grade: 2,
    news_response: '중립',
    labels: ['코스피']
  },
  {
    category: 'ETF',
    product_code: 'ETF003',
    country: '국외',
    etf_type: '혼합형',
    product_name: 'ARIRANG 미국리츠',
    nav: 8760,
    volume: 12800,
    rate_of_return: '-0.8% (1개월)',
    risk_grade: 4,
    news_response: '부정',
    labels: ['코스피']
  }
];

const filteredNewsList = computed(() => {
  if (!selectKeyword.value) return [];
  return allNews.value.filter(news => news.labels.includes(selectKeyword.value));
});

const filteredProductList = computed(() => {
  if (!selectKeyword.value) return [];
  return allProducts.value.filter(product => product.labels.includes(selectKeyword.value));
});

onMounted(() => {
  headerStore.setHeader({
    titleParts: [
      { text: 'OOO', color: 'var(--sub01)' },
      { text: '님, 반갑습니다.', color: 'var(--main01)' }
    ]
  });

  const keywordAnalysis = new Map();
  rawNewsData.forEach(news => {
    news.labels.forEach(label => {
      if (!keywordAnalysis.has(label)) {
        keywordAnalysis.set(label, {
          newsCount: 0,
          sentiments: { positive: 0, neutral: 0, negative: 0 }
        });
      }
      const analysis = keywordAnalysis.get(label);
      analysis.newsCount++;
      analysis.sentiments[news.sentiment]++;
    });
  });

  const bubbleChartData = Array.from(keywordAnalysis.entries())
    .map(([label, analysis]) => {
      const dominantSentiment = Object.keys(analysis.sentiments).reduce((a, b) =>
        analysis.sentiments[a] > analysis.sentiments[b] ? a : b
      );
      return {
        label: label,
        value: analysis.newsCount,
        sentiment: dominantSentiment
      };
    })
    .sort((a, b) => b.value - a.value);

  chartData.value = bubbleChartData.slice(0, 10);
  allNews.value = rawNewsData;
  allProducts.value = rawProductData;
});

onBeforeRouteLeave((to, from) => {
  headerStore.resetHeader();
});
</script>

<style scoped>
.home-box {
  margin: 20px 0;
}

.line {
  height: 10px;
  background-color: var(--main04);
  margin-left: calc(-1 * 20px);
  margin-right: calc(-1 * 20px);
  width: calc(100% + 40px);
}
</style>

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import Decimal from 'decimal.js';
import { useLoadingStore } from './loading';
import { formatNumberWithComma } from '@/utils/numberUtils';

// ETF 상품 관련 상태 및 로직을 관리하는 Pinia 스토어
export const useEtfStore = defineStore('etf', () => {
  // State
  const product = ref(null);
  const isLoading = ref(false);
  const error = ref(null);
  const loadingStore = useLoadingStore();

  // 수익률 히스토리 관련 상태
  const yieldHistory = ref(null);
  const isYieldHistoryLoaded = ref(false);
  const isYieldHistoryLoading = ref(false);

  // Mock 데이터 (API 호출 실패 시 사용)
  const mockProductData = {
    productCode: 'etf-001',
    productName: 'TIGER 미국S&P500',
    productCompanyName: 'TIGER',
    productRiskGrade: 4,
    etfCountry: 'foreign',
    etfType: 'equity',
    etfDelistingStatus: false,
    etfNetAssets: 25.23,
    etfFundCharacteristics: 'S&P500 지수를 추종하는 대표적인 ETF 상품',
    etfManagementStrategy:
      '이 펀드는 S&P500 지수의 수익률을 최대한 근접하게 추종하는 것을 목표로 하며, 분산 투자와 저비용 운용을 통해 안정적인 성과를 추구합니다.',
    etfTotalExpenseRatio: 0.09,
    etfCollectiveInvestmentAgreementUrl: 'https://www.samsungfund.com/docs/rule.pdf',
    etfInvestmentProspectusUrl: 'https://www.samsungfund.com/docs/desc.pdf',
    etfSimplifiedProspectusUrl: 'https://www.samsungfund.com/docs/simple.pdf',
    etfBenchmarkIndex: 'S&P500',
    eAssetAllocation: [
      { eAssetAllocationType: '애플', eAssetAllocationPer: 7.2 },
      { eAssetAllocationType: '마이크로소프트', eAssetAllocationPer: 6.5 },
      { eAssetAllocationType: '아마존', eAssetAllocationPer: 3.8 },
      { eAssetAllocationType: '엔비디아', eAssetAllocationPer: 3.2 },
      { eAssetAllocationType: '기타', eAssetAllocationPer: 79.3 }
    ],
    eEquityRatio: [{ eEquityRatioName: '주식', eEquityRatioPer: 100 }],
    eConstituentStocks: [
      { eConstituentStocksName: '애플', eConstituentPer: 7.2 },
      { eConstituentStocksName: '마이크로소프트', eConstituentPer: 6.5 },
      { eConstituentStocksName: '아마존', eConstituentPer: 3.8 },
      { eConstituentStocksName: '엔비디아', eConstituentPer: 3.2 }
    ],
    etfListingDate: '2010-10-14',
    etfMinTradingUnit: 1,
    etfTaxType: '배당소득세',
    // Mock 시세 데이터
    currentPrice: 15000,
    previousPrice: 14800,
    priceChange: 200,
    priceChangePercent: 1.35,
    yield: 2.5,
    priceHistory: [
      { date: '2024-06-01', price: 12000 },
      { date: '2024-06-02', price: 12100 },
      { date: '2024-06-03', price: 12200 },
      { date: '2024-06-04', price: 12300 },
      { date: '2024-06-05', price: 12500 },
      { date: '2024-06-06', price: 12480 },
      { date: '2024-06-07', price: 12600 },
      { date: '2024-06-08', price: 12530 },
      { date: '2024-06-09', price: 12650 },
      { date: '2024-06-10', price: 12520 },
      { date: '2024-06-11', price: 12700 },
      { date: '2024-06-12', price: 12640 },
      { date: '2024-06-13', price: 12800 },
      { date: '2024-06-14', price: 12760 }
    ],
    // Mock 뉴스 데이터 (실제 API 구조에 맞춰 수정)
    etfNewsResponse: [
      {
        newsId: 'news-001',
        newsTitle: 'S&P 500 지수 상승세 지속, 기술주 중심으로 강세',
        newsSummary: '미국 주식시장이 기술주 중심으로 상승세를 보이고 있습니다.',
        newsContentUrl: 'https://example.com/news/001',
        newsPublishedAt: [2024, 6, 14, 10, 0],
        newsScore: 0.85,
        newsSentiment: 'positive',
        newsPublisher: 'Bloomberg'
      },
      {
        newsId: 'news-002',
        newsTitle: '연준 금리 정책에 대한 시장 기대감 변화',
        newsSummary: '연방준비제도가 금리 인하 가능성을 시사하며 시장이 반등했습니다.',
        newsContentUrl: 'https://example.com/news/002',
        newsPublishedAt: [2024, 6, 13, 15, 30],
        newsScore: 0.78,
        newsSentiment: 'positive',
        newsPublisher: 'Reuters'
      }
    ],
    // Mock 보유 내역 데이터 (보유하지 않은 경우 null)
    holdings: null
  };

  // API 호출 함수
  const fetchProductDetail = async (productId, category, token) => {
    try {
      const response = await fetch(`http://localhost:8080/products/${category}/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('상품 상세 정보를 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      console.log('Product API Response:', data);
      console.log('News data in API response:', data.etfNewsResponse);
      return data;
    } catch (error) {
      console.error('Product API Error:', error);
      console.log('Using mock data due to API failure');

      // API 호출 실패 시 Mock 데이터 반환
      return {
        ...mockProductData,
        productCode: productId,
        // 보유 내역은 실제 API에서만 받아오므로 Mock에서는 null
        holdings: null
      };
    }
  };

  // Actions - fetchProduct 함수 수정
  async function fetchProduct(productId, category = 'etf', token) {
    isLoading.value = true;
    loadingStore.resetLoading();
    loadingStore.startLoading('ETF 정보를 불러오는 중...');
    error.value = null;

    // 토큰이 전달되지 않았으면 localStorage에서 가져오기
    const authToken = token || localStorage.getItem('accessToken');

    console.log('Using token:', authToken ? 'Token exists' : 'No token');

    try {
      // 하나의 API로 모든 정보 가져오기
      const productDetail = await fetchProductDetail(productId, category, authToken);

      // 데이터 가공
      product.value = processEtfData(productDetail, productId);
    } catch (e) {
      error.value = `ETF 상품 정보를 불러오는 데 실패했습니다: ${e.message}`;
      console.error(e);
    } finally {
      isLoading.value = false;
      loadingStore.stopLoading();
    }
  }

  // ETF 데이터 가공 함수 수정
  const processEtfData = (productDetail, originalProductId) => {
    console.log('processEtfData - productDetail:', productDetail);

    // 실제 전달된 productId 사용
    const productId = originalProductId;

    const result = {
      // 기본 상품 정보 (API 응답)
      ...productDetail,

      // UI용 데이터 가공
      info: generateInfoTab(productDetail),
      composition: generateCompositionTab(productDetail),
      pdf: generatePdfTab(productDetail),
      yield: generateYieldTab(productDetail),
      news: (() => {
        console.log('Processing news data in processEtfData');
        const newsData = generateNewsTab(productDetail);
        console.log('Generated news data:', newsData);
        return newsData;
      })(),

      // 보유 내역 데이터 가공 (API 응답에서)
      holding: generateHoldingTab(productDetail.holdings, productDetail),

      // 시세 데이터 가공 (시세 데이터가 없는 경우 기본값 사용)
      price: generatePriceData(productDetail),

      // 보유 여부 판단
      isHolding: !!productDetail.holdings,
      holdingQuantity: productDetail.holdings?.holdings_total_quantity || 0,

      // 찜 여부 판단
      isWatched: productDetail.holdings?.is_watched || false,

      // DetailMainEtf 컴포넌트용 데이터
      yield: productDetail.etfPriceSummaryDto?.percent_change_from_3_months_ago || 0, // 3개월 수익률
      currentPrice: productDetail.currentPrice ? productDetail.currentPrice.toLocaleString() : '0',
      productCompanyName: productDetail.productCompanyName || 'TIGER',
      productName: productDetail.productName || 'TIGER 미국S&P500선물 ETN',
      productCode: productDetail.productCode || productId,
      productRiskGrade: productDetail.productRiskGrade || 3,
      etfNetAssets: productDetail.etfNetAssets
        ? `${(productDetail.etfNetAssets / 1e8).toFixed(2)}억원`
        : '25.23억원'
    };

    console.log('Final processed ETF data:', result);
    return result;
  };

  // 시세 데이터 가공 함수 (시세 데이터가 없는 경우 처리)
  const generatePriceData = productDetail => {
    // 시세 데이터가 없는 경우 기본값 반환
    if (!productDetail.currentPrice) {
      return {
        currentPrice: 0,
        previousPrice: 0,
        priceChange: 0,
        priceChangePercent: 0,
        priceArr: [new Decimal(0), new Decimal(0)]
      };
    }

    return {
      currentPrice: productDetail.currentPrice || 0,
      previousPrice: productDetail.previousPrice || 0,
      priceChange: productDetail.priceChange || 0,
      priceChangePercent: productDetail.priceChangePercent || 0,
      priceArr: [
        new Decimal(productDetail.currentPrice || 0),
        new Decimal(productDetail.previousPrice || 0)
      ]
    };
  };

  // 뉴스 데이터 가공 함수 (DetailNewsList.vue 형식에 맞춰 수정)
  const generateNewsTab = productDetail => {
    console.log('generateNewsTab - productDetail:', productDetail);
    const newsData = productDetail.etfNewsResponse;
    console.log('generateNewsTab - newsData:', newsData);

    if (!newsData || !newsData.length) {
      console.log('No news data available');
      return [];
    }

    try {
      return [
        {
          type: 'news',
          title: 'ETF 관련 뉴스',
          keyword: 'ETF',
          color: '#007AFF',
          desc: newsData.map(news => {
            console.log('Processing news item:', news);

            // 날짜 배열을 Date 객체로 변환
            const [year, month, day, hour, minute] = news.newsPublishedAt;
            const publishedDate = new Date(year, month - 1, day, hour, minute);

            // DetailNewsList.vue 형식에 맞춰 데이터 변환
            const processedNews = {
              news_id: news.newsId,
              news_title: news.newsTitle,
              news_content_url: news.newsContentUrl,
              news_published_at: publishedDate.toISOString(), // ISO 문자열로 변환
              news_score: news.newsScore / 100,
              news_sentiment: news.newsSentiment,
              news_publisher: news.newsPublisher
            };

            console.log('Processed news item:', processedNews);
            return processedNews;
          })
        }
      ];
    } catch (error) {
      console.error('Error processing news data:', error);
      return [];
    }
  };

  // 수익률 데이터 가공 함수 (그래프용) - ETF는 수익률만 표시
  const generateYieldTab = productDetail => {
    // 실제 API에서 받아온 히스토리 데이터 사용
    const priceHistory = yieldHistory.value || productDetail.priceHistory;
    if (!priceHistory || !priceHistory.length) return [];

    // 새로운 데이터 구조에 맞게 처리 (baseDate, etfNav)
    const chartData = priceHistory.map(item => {
      const date = item.baseDate
        ? `${item.baseDate[0]}-${String(item.baseDate[1]).padStart(2, '0')}-${String(item.baseDate[2]).padStart(2, '0')}`
        : item.date;
      const price = item.etfNav || item.price;
      const firstPrice = priceHistory[0].etfNav || priceHistory[0].price;
      const yieldValue = item.yield || (((price - firstPrice) / firstPrice) * 100).toFixed(1);

      return {
        date: date,
        수익률: yieldValue
      };
    });

    return [
      {
        type: 'areachart',
        title: '수익률 추이',
        desc: chartData
      },
      {
        type: 'text',
        title: '상장일',
        desc: Array.isArray(productDetail.etfListingDate)
          ? `${productDetail.etfListingDate[0]}-${String(productDetail.etfListingDate[1]).padStart(2, '0')}-${String(productDetail.etfListingDate[2]).padStart(2, '0')}`
          : productDetail.etfListingDate || '2021-06-10'
      },
      { type: 'text', title: '총보수', desc: `${productDetail.etfTotalExpenseRatio || 0.5}%` },
      {
        type: 'text',
        title: '기초지수',
        desc: productDetail.etfBenchmarkIndex || 'iSelect 비메모리반도체 지수(시장가격지수)'
      }
    ];
  };

  // 정보 탭 생성 함수 (실제 API 응답 구조에 맞춰 수정)
  const generateInfoTab = productDetail => {
    return [
      {
        type: 'text',
        title: '상품명',
        desc: productDetail.productName || 'TIGER 미국S&P500선물 ETN'
      },
      { type: 'text', title: '운용사', desc: productDetail.productCompanyName || 'TIGER' },
      {
        type: 'longtext',
        title: '펀드 특징',
        desc: productDetail.etfFundCharacteristics || 'S&P500 지수를 추종하는 대표적인 ETF 상품'
      },
      {
        type: 'longtext',
        title: '운용 전략',
        desc:
          productDetail.etfManagementStrategy ||
          '이 펀드는 S&P500 지수의 수익률을 최대한 근접하게 추종하는 것을 목표로 하며, 분산 투자와 저비용 운용을 통해 안정적인 성과를 추구합니다.'
      },
      { type: 'text', title: '위험 등급', desc: `${productDetail.productRiskGrade || 3}등급` },
      {
        type: 'text',
        title: '순자산 총액',
        desc: productDetail.etfNetAssets
          ? `${(productDetail.etfNetAssets / 1e8).toFixed(2)}억원`
          : '25.23억원'
      },
      { type: 'text', title: '총보수', desc: `${productDetail.etfTotalExpenseRatio || 0.09}%` },
      { type: 'text', title: '기초지수', desc: productDetail.etfBenchmarkIndex || 'S&P500' },
      {
        type: 'text',
        title: '상장일',
        desc: Array.isArray(productDetail.etfListingDate)
          ? `${productDetail.etfListingDate[0]}-${String(productDetail.etfListingDate[1]).padStart(2, '0')}-${String(productDetail.etfListingDate[2]).padStart(2, '0')}`
          : productDetail.etfListingDate || '2010-10-14'
      },
      { type: 'text', title: '최소 거래 단위', desc: `${productDetail.etfMinTradingUnit || 1}주` },
      { type: 'text', title: '과세 유형', desc: productDetail.etfTaxType || '배당소득세' }
    ];
  };

  // 구성 탭 생성 함수 (실제 API 응답 구조에 맞춰 수정)
  const generateCompositionTab = productDetail => {
    const result = [];

    // 자산 배분 정보 (실제 API 구조에 맞춰 수정)
    if (productDetail.eassetAllocation && productDetail.eassetAllocation.length > 0) {
      result.push({
        type: 'piechart',
        title: '자산 배분',
        desc: productDetail.eassetAllocation.map(item => ({
          종목명: item.eassetAllocationType,
          비중: `${item.eassetAllocationPer}%`
        }))
      });
    }

    // 지분 비율 정보 (실제 API 구조에 맞춰 수정)
    if (productDetail.eequityRatio && productDetail.eequityRatio.length > 0) {
      result.push({
        type: 'table',
        title: '지분 비율',
        desc: productDetail.eequityRatio.map(item => ({
          종목명: item.eequityRatioName,
          비중: `${item.eequityRatioPer}%`
        }))
      });
    }

    // 구성 종목 정보 (실제 API 구조에 맞춰 수정)
    if (productDetail.econstituentStocks && productDetail.econstituentStocks.length > 0) {
      result.push({
        type: 'table',
        title: '구성종목',
        desc: productDetail.econstituentStocks.map(item => ({
          종목명: item.econstituentStocksName,
          비중: `${item.econstituentPer}%`
        }))
      });
    }

    return result;
  };

  // PDF 탭 생성 함수 (실제 API 응답 구조에 맞춰 수정)
  const generatePdfTab = productDetail => {
    return [
      {
        type: 'pdf',
        title: '공시/보고서',
        desc: [
          {
            category: '성과보고서',
            items: [
              {
                label: '자산운용보고서(3개월)',
                url: 'https://www.samsungfund.com/report/asset-3m.pdf'
              }
            ]
          },
          {
            category: '공시문서',
            items: [
              {
                label: '집합투자규약',
                url:
                  productDetail.etfCollectiveInvestmentAgreementUrl ||
                  'https://www.samsungfund.com/docs/rule.pdf'
              },
              {
                label: '투자설명서',
                url:
                  productDetail.etfInvestmentProspectusUrl ||
                  'https://www.samsungfund.com/docs/desc.pdf'
              },
              {
                label: '간이투자설명서',
                url:
                  productDetail.etfSimplifiedProspectusUrl ||
                  'https://www.samsungfund.com/docs/simple.pdf'
              }
            ]
          }
        ]
      }
    ];
  };

  // 보유 내역 탭 생성 함수 수정 (실제 API 응답 구조에 맞춰 수정)
  const generateHoldingTab = (holdingData, productDetail) => {
    console.log('generateHoldingTab - holdingData:', holdingData);

    if (!holdingData) {
      console.log('No holding data available');
      return [];
    }

    // 현재 시세로 평가액 계산 (Decimal 사용)
    // 시세 데이터가 없는 경우 기본값 사용
    const currentPrice = new Decimal(productDetail.currentPrice || 12500);
    const holdingsTotalQuantity = new Decimal(holdingData.holdings_total_quantity || 0);
    const holdingsTotalPrice = new Decimal(holdingData.holdings_total_price || 0);

    const currentTotalValue = holdingsTotalQuantity.mul(currentPrice);
    const avgPrice = holdingsTotalQuantity.gt(0)
      ? holdingsTotalPrice.div(holdingsTotalQuantity)
      : new Decimal(0);
    const profitLoss = currentTotalValue.sub(holdingsTotalPrice);
    const profitLossPercent = holdingsTotalPrice.gt(0)
      ? profitLoss.div(holdingsTotalPrice).mul(100)
      : new Decimal(0);

    const result = [
      {
        type: 'holdingsummary',
        title: '보유 현황',
        desc: {
          holdingsTotalPrice: holdingsTotalPrice.toNumber(),
          holdingsTotalQuantity: holdingsTotalQuantity.toNumber(),
          currentPricePerUnit: currentPrice.toNumber(),
          currentTotalValue: currentTotalValue.toNumber(),
          avgPrice: avgPrice.toNumber(),
          profitLoss: profitLoss.toNumber(),
          profitLossPercent: profitLossPercent.toFixed(2)
        }
      }
    ];

    // holdingsTotalQuantity가 0보다 크고 holdingsStatus가 'zero'가 아닐 때만 투자 기록 추가
    if (holdingsTotalQuantity.gt(0) && holdingData.holdings_status !== 'zero') {
      result.push({
        type: 'holdinghistory',
        title: '투자 기록',
        desc:
          holdingData.history?.map(item => {
            // 거래 타입에 따른 표시 형식 설정
            const isSell = item.historyTradeType === 'sell';
            const isBuy = item.historyTradeType === 'buy';

            // 거래 수량에 부호 추가 (콤마 포함)
            const quantity = new Decimal(item.historyQuantity || 0);
            const displayQuantity = isSell
              ? `-${formatNumberWithComma(quantity.toNumber())}`
              : `+${formatNumberWithComma(quantity.toNumber())}`;

            // 거래 금액에 부호 추가 (콤마 포함)
            const amount = new Decimal(item.historyAmount || 0);
            const displayAmount = isSell
              ? `-${formatNumberWithComma(amount.toNumber())}`
              : `+${formatNumberWithComma(amount.toNumber())}`;

            // 날짜 형식 수정 (yyyy/mm/dd 오전 hh:mm:ss)
            const tradeDate = new Date(item.historyTradeDate);
            const year = tradeDate.getFullYear();
            const month = String(tradeDate.getMonth() + 1).padStart(2, '0');
            const day = String(tradeDate.getDate()).padStart(2, '0');
            const hours = tradeDate.getHours();
            const minutes = String(tradeDate.getMinutes()).padStart(2, '0');
            const seconds = String(tradeDate.getSeconds()).padStart(2, '0');
            const ampm = hours < 12 ? '오전' : '오후';
            const displayHours = String(hours < 12 ? hours : hours - 12).padStart(2, '0');
            const displayDate = `${year}/${month}/${day} ${ampm} ${displayHours}:${minutes}:${seconds}`;

            return {
              ...item,
              // 원본 데이터 유지
              historyQuantity: item.historyQuantity,
              historyAmount: item.historyAmount,
              historyTradeDate: item.historyTradeDate,
              // 표시용 데이터 추가
              displayQuantity,
              displayAmount,
              displayDate,
              // 스타일링을 위한 플래그
              isSell,
              isBuy,
              // 색상 정보
              quantityColor: isSell ? '#FF3B30' : '#007AFF',
              amountColor: isSell ? '#FF3B30' : '#007AFF'
            };
          }) || []
      });
    }

    console.log('Generated holding tab data:', result);
    return result;
  };

  // tabData computed 수정
  const tabData = computed(() => {
    if (!product.value) return {};

    const baseTabData = {
      info: product.value.info,
      yield: generateYieldTab(product.value),
      composition: product.value.composition,
      news: product.value.news
    };

    // 보유 중인 상품이면 holding 데이터 추가
    if (product.value.isHolding && product.value.holding) {
      baseTabData.holding = product.value.holding;
    }

    return baseTabData;
  });

  // Getters
  const productInfo = computed(() => product.value);

  // 찜 여부 getter 추가
  const isWatched = computed(() => {
    const watched = product.value?.isWatched || false;
    console.log('isWatched computed - value:', watched);
    return watched;
  });

  // 수익률 히스토리 API 호출 함수
  const fetchYieldHistory = async (productId, token) => {
    // 이미 로드된 경우 다시 호출하지 않음
    if (isYieldHistoryLoaded.value) {
      return yieldHistory.value;
    }

    isYieldHistoryLoading.value = true;
    const authToken = token || localStorage.getItem('accessToken');

    try {
      const response = await fetch(`http://localhost:8080/etf/${productId}/history`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('수익률 히스토리를 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      console.log('Yield History API Response:', data);

      yieldHistory.value = data;
      isYieldHistoryLoaded.value = true;
      return data;
    } catch (error) {
      console.error('Yield History API Error:', error);
      // API 실패 시 Mock 데이터 반환
      const mockHistory = [
        { baseDate: [2025, 6, 19], etfNav: 12451.92 },
        { baseDate: [2025, 6, 20], etfNav: 12640.32 },
        { baseDate: [2025, 6, 21], etfNav: 12826.89 },
        { baseDate: [2025, 6, 22], etfNav: 12890.51 },
        { baseDate: [2025, 6, 23], etfNav: 12600.29 },
        { baseDate: [2025, 6, 24], etfNav: 12307.0 },
        { baseDate: [2025, 6, 25], etfNav: 12480.02 },
        { baseDate: [2025, 6, 26], etfNav: 12718.15 },
        { baseDate: [2025, 6, 27], etfNav: 13068.27 },
        { baseDate: [2025, 6, 28], etfNav: 13067.99 },
        { baseDate: [2025, 6, 29], etfNav: 12998.96 },
        { baseDate: [2025, 6, 30], etfNav: 12685.7 },
        { baseDate: [2025, 7, 22], etfNav: 12736.72 }
      ];
      yieldHistory.value = mockHistory;
      isYieldHistoryLoaded.value = true;
      return mockHistory;
    } finally {
      isYieldHistoryLoading.value = false;
    }
  };

  // 수익률 히스토리 초기화 함수 (페이지 새로고침 시 사용)
  const resetYieldHistory = () => {
    yieldHistory.value = null;
    isYieldHistoryLoaded.value = false;
    isYieldHistoryLoading.value = false;
  };

  // 실시간 웹소켓 데이터 업데이트 함수
  const updateRealtimeData = realtimeData => {
    if (!product.value) return;

    console.log('[ETF STORE] 실시간 데이터 수신:', realtimeData);

    // 실시간 데이터로 product 업데이트
    const updatedProduct = {
      ...product.value,
      currentPrice:
        realtimeData?.current_price || realtimeData?.price || product.value.currentPrice,
      change_rate1s:
        realtimeData?.change_rate1s || realtimeData?.changeRate || product.value.change_rate1s,
      volume: realtimeData?.current_volume || realtimeData?.volume || product.value.volume,
      tradeAmount:
        realtimeData?.trade_amount || realtimeData?.tradeAmount || product.value.tradeAmount,
      marketCap: realtimeData?.market_cap || realtimeData?.marketCap || product.value.marketCap,
      lastUpdate: realtimeData?.timestamp || realtimeData?.time || new Date().toISOString()
    };

    // 보유기록이 있는 경우 현재가와 평가액 업데이트
    if (updatedProduct.holding && updatedProduct.holding.length > 0) {
      const currentPrice =
        realtimeData?.current_price || realtimeData?.price || updatedProduct.currentPrice;

      console.log('[ETF STORE] 보유기록 업데이트 - 현재가:', currentPrice);

      // 보유기록 데이터 업데이트
      updatedProduct.holding = updatedProduct.holding.map(holdingItem => {
        if (holdingItem.type === 'holdingsummary') {
          const holdingsTotalQuantity = new Decimal(holdingItem.desc.holdingsTotalQuantity || 0);
          const currentTotalValue = holdingsTotalQuantity.mul(currentPrice);

          console.log('[ETF STORE] 보유기록 계산:', {
            holdingsTotalQuantity: holdingsTotalQuantity.toNumber(),
            currentPrice,
            currentTotalValue: currentTotalValue.toNumber()
          });

          return {
            ...holdingItem,
            desc: {
              ...holdingItem.desc,
              currentPricePerUnit: currentPrice,
              currentTotalValue: currentTotalValue.toNumber()
            }
          };
        }
        return holdingItem;
      });
    }

    product.value = updatedProduct;
    console.log('[ETF STORE] 실시간 데이터 업데이트 완료');
  };

  return {
    product,
    isLoading,
    error,
    fetchProduct,
    productInfo,
    tabData,
    isWatched,
    // 수익률 히스토리 관련
    yieldHistory,
    isYieldHistoryLoaded,
    isYieldHistoryLoading,
    fetchYieldHistory,
    resetYieldHistory,
    // 실시간 데이터 업데이트
    updateRealtimeData
  };
});

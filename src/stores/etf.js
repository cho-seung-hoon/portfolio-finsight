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

  const chartData = ref([]);

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
    holdings: null
  };

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
      return await response.json();
    } catch (error) {
      console.error('Product API Error:', error);
      console.log('Using mock data due to API failure');
      return { ...mockProductData, productCode: productId, holdings: null };
    }
  };

  async function fetchProduct(productId, category = 'etf', token) {
    isLoading.value = true;
    loadingStore.resetLoading();
    loadingStore.startLoading('ETF 정보를 불러오는 중...');
    error.value = null;
    const authToken = token || localStorage.getItem('accessToken');
    try {
      const productDetail = await fetchProductDetail(productId, category, authToken);
      product.value = processEtfData(productDetail, productId);
    } catch (e) {
      error.value = `ETF 상품 정보를 불러오는 데 실패했습니다: ${e.message}`;
      console.error(e);
    } finally {
      isLoading.value = false;
      loadingStore.stopLoading();
    }
  }

  const processEtfData = (productDetail, originalProductId) => {
    // 디버깅용 console.log는 유지하거나 필요에 따라 제거하세요.
    // console.log('processEtfData - productDetail:', productDetail);

    const result = {
      ...productDetail,
      info: generateInfoTab(productDetail),
      composition: generateCompositionTab(productDetail),
      pdf: generatePdfTab(productDetail),
      yield: generateYieldTab(productDetail),
      news: generateNewsTab(productDetail),
      holding: generateHoldingTab(productDetail.holdings, productDetail),
      price: generatePriceData(productDetail),
      isHolding: !!productDetail.holdings,
      holdingQuantity: productDetail.holdings?.holdings_total_quantity || 0,
      isWatched: productDetail.holdings?.isWatched ?? productDetail.holdings?.is_watched ?? false,
      yield3Months: productDetail.etfPriceSummaryDto?.percentChangeFrom3MonthsAgo ?? 0,
      currentPrice: productDetail.currentPrice ? productDetail.currentPrice.toLocaleString() : '0',
      productCompanyName: productDetail.productCompanyName || 'TIGER',
      productName: productDetail.productName || 'TIGER 미국S&P500선물 ETN',
      productCode: productDetail.productCode || originalProductId,
      productRiskGrade: productDetail.productRiskGrade || 3,
      etfNetAssets: productDetail.etfNetAssets
        ? `${(productDetail.etfNetAssets / 1e8).toFixed(2)}억원`
        : '25.23억원'
    };
    return result;
  };

  const generatePriceData = productDetail => {
    // ETF도 카멜케이스만 사용
    const priceSummary = productDetail.etfPriceSummaryDto || productDetail.priceSummary;
    if (!priceSummary) {
      return {
        currentPrice: 0,
        previousPrice: 0,
        priceChange: 0,
        priceChangePercent: 0
      };
    }

    const currentNav =
      priceSummary.currentNav ?? productDetail.currentNav ?? productDetail.currentPrice ?? 0;
    const changeFromYesterday = priceSummary.changeFromYesterday ?? productDetail.priceChange ?? 0;
    const priceChangePercent =
      priceSummary.percentChangeFromYesterday ?? productDetail.priceChangePercent ?? 0;
    const previousNav = new Decimal(currentNav).sub(changeFromYesterday).toNumber();

    return {
      currentPrice: currentNav,
      previousPrice: previousNav,
      priceChange: changeFromYesterday,
      priceChangePercent
    };
  };

  const generateNewsTab = productDetail => {
    const newsData = productDetail.etfNewsResponse;
    if (!newsData || !newsData.length) return [];
    try {
      return [
        {
          type: 'news',
          title: 'ETF 관련 뉴스',
          keyword: 'ETF',
          color: '#007AFF',
          desc: newsData.map(news => {
            const [year, month, day, hour, minute] = news.newsPublishedAt;
            const publishedDate = new Date(year, month - 1, day, hour, minute);
            return {
              news_id: news.newsId,
              news_title: news.newsTitle,
              news_content_url: news.newsContentUrl,
              news_published_at: publishedDate.toISOString(),
              news_score: news.newsScore / 100,
              news_sentiment: news.newsSentiment,
              news_publisher: news.newsPublisher
            };
          })
        }
      ];
    } catch (error) {
      console.error('Error processing news data:', error);
      return [];
    }
  };

  const generateYieldTab = productDetail => {
    const priceHistory = yieldHistory.value || productDetail.priceHistory;
    if (!priceHistory || !priceHistory.length) return [];
    const chartData = priceHistory.map(item => {
      const date = item.baseDate
        ? `${item.baseDate[0]}-${String(item.baseDate[1]).padStart(2, '0')}-${String(item.baseDate[2]).padStart(2, '0')}`
        : item.date;
      const price = item.etfNav || item.price;
      const firstPrice = priceHistory[0].etfNav || priceHistory[0].price;
      const yieldValue = item.yield || (((price - firstPrice) / firstPrice) * 100).toFixed(1);
      return { date: date, 수익률: yieldValue };
    });
    return [
      { type: 'areachart', title: '수익률 추이', desc: chartData },
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
        desc: productDetail.currentAum
          ? `${(productDetail.currentAum / 1e8).toFixed(2)}억원`
          : productDetail.etfNetAssets
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

  const generateCompositionTab = productDetail => {
    const result = [];
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

  const generateHoldingTab = (holdingData, productDetail) => {
    if (!holdingData) return [];

    const currentPrice = new Decimal(
      productDetail.currentNav ?? productDetail.currentPrice ?? 12500
    );
    const holdingsTotalQuantity = new Decimal(
      holdingData.holdingsTotalQuantity ?? holdingData.holdings_total_quantity ?? 0
    );
    const holdingsTotalPrice = new Decimal(
      holdingData.holdingsTotalPrice ?? holdingData.holdings_total_price ?? 0
    );
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

    if (
      holdingsTotalQuantity.gt(0) &&
      (holdingData.holdingsStatus ?? holdingData.holdings_status) !== 'zero'
    ) {
      result.push({
        type: 'holdinghistory',
        title: '투자 기록',
        desc:
          holdingData.history?.map(item => {
            const isSell = item.historyTradeType === 'sell';
            const quantity = new Decimal(item.historyQuantity || 0);
            const displayQuantity = isSell
              ? `-${formatNumberWithComma(quantity.toNumber())}`
              : `+${formatNumberWithComma(quantity.toNumber())}`;
            const amount = new Decimal(item.historyAmount || 0);
            const displayAmount = isSell
              ? `-${formatNumberWithComma(amount.toNumber())}`
              : `+${formatNumberWithComma(amount.toNumber())}`;
            const tradeDate = new Date(item.historyTradeDate);
            const year = tradeDate.getFullYear();
            const month = String(tradeDate.getMonth() + 1).padStart(2, '0');
            const day = String(tradeDate.getDate()).padStart(2, '0');
            const hours = tradeDate.getHours();
            const minutes = String(tradeDate.getMinutes()).padStart(2, '0');
            const seconds = String(tradeDate.getSeconds()).padStart(2, '0');
            const ampm = hours < 12 ? '오전' : '오후';
            const displayHours = String(hours % 12 || 12).padStart(2, '0');
            const displayDate = `${year}/${month}/${day} ${ampm} ${displayHours}:${minutes}:${seconds}`;

            return {
              ...item,
              displayQuantity,
              displayAmount,
              displayDate,
              isSell,
              isBuy: !isSell,
              quantityColor: isSell ? '#FF3B30' : '#007AFF',
              amountColor: isSell ? '#FF3B30' : '#007AFF'
            };
          }) || []
      });
    }
    return result;
  };

  const tabData = computed(() => {
    if (!product.value) return {};
    const baseTabData = {
      info: product.value.info,
      composition: product.value.composition,
      news: product.value.news,
      yield: [
        {
          type: 'areachart',
          title: '수익률 추이',
          desc: chartData.value // chartData와 직접 연결
        },
        ...product.value.yield.slice(1) // 기존의 상장일, 총보수 등 정보 유지
      ]
    };
    if (product.value.isHolding) {
      baseTabData.holding = product.value.holding;
    }
    return baseTabData;
  });

  const productInfo = computed(() => product.value);
  const isWatched = computed(() => product.value?.isWatched || false);

  const fetchYieldHistory = async (productId, token) => {
    if (isYieldHistoryLoaded.value) return;
    isYieldHistoryLoading.value = true;
    const authToken = token || localStorage.getItem('accessToken');
    try {
      const response = await fetch(`http://localhost:8080/etf/${productId}/history`, {
        headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('수익률 히스토리 로딩 실패');
      chartData.value = await response.json();
    } catch (error) {
      console.error('Yield History API Error:', error);
      chartData.value = [
        { baseDate: [2025, 6, 19], etfNav: 12451.92 },
        { baseDate: [2025, 6, 20], etfNav: 12640.32 }
      ];
    } finally {
      isYieldHistoryLoaded.value = true;
      isYieldHistoryLoading.value = false;
    }
  };

  const resetYieldHistory = () => {
    yieldHistory.value = null;
    chartData.value = [];
    isYieldHistoryLoaded.value = false;
    isYieldHistoryLoading.value = false;
  };

  // [핵심 수정] 실시간 웹소켓 데이터 업데이트 함수
  const updateRealtimeData = realtimeData => {
    if (!product.value || !realtimeData) return;

    if (realtimeData && realtimeData.timestamp) {
      chartData.value = [...chartData.value, realtimeData];
    }

    const newPrice = realtimeData?.currentPrice;

    // [설명] 새로운 가격 정보가 있을 때만 가격 관련 상태를 '직접' 수정합니다.
    // 이렇게 하면 Vue는 정확히 변경된 부분만 감지하여 불필요한 재계산을 방지합니다.
    if (newPrice !== undefined) {
      // 1. 최상위 현재가 정보 업데이트
      product.value.currentPrice = newPrice;

      // 2. price 객체 내부 정보 업데이트
      if (product.value.price) {
        product.value.price.currentPrice = newPrice;

        // [수정 후] 서버가 보내준 계산된 값을 그대로 사용 (카멜케이스 고정)
        product.value.price.priceChange =
          realtimeData.changeFromPrevDay ?? product.value.price.priceChange;
        product.value.price.priceChangePercent =
          realtimeData.changeRateFromPrevDay ?? product.value.price.priceChangePercent;
      }

      // 3. 보유 내역이 있는 경우, 평가액과 손익 정보 업데이트
      if (product.value.isHolding && product.value.holding?.length > 0) {
        const holdingSummary = product.value.holding.find(item => item.type === 'holdingsummary');
        if (holdingSummary) {
          const desc = holdingSummary.desc;
          const holdingsTotalQuantity = new Decimal(desc.holdingsTotalQuantity || 0);
          const holdingsTotalPrice = new Decimal(desc.holdingsTotalPrice || 0);

          const currentTotalValue = holdingsTotalQuantity.mul(newPrice);
          const profitLoss = currentTotalValue.sub(holdingsTotalPrice);

          // 보유 현황(desc) 객체 내부의 값들을 직접 수정
          desc.currentPricePerUnit = newPrice;
          desc.currentTotalValue = currentTotalValue.toNumber();
          desc.profitLoss = profitLoss.toNumber();
          if (holdingsTotalPrice.gt(0)) {
            desc.profitLossPercent = profitLoss.div(holdingsTotalPrice).mul(100).toFixed(2);
          }
        }
      }
    }

    // [설명] 기타 실시간 정보가 있다면 동일한 방식으로 직접 수정할 수 있습니다.
    // product.value.volume = realtimeData?.current_volume ?? product.value.volume;
  };

  return {
    product,
    isLoading,
    error,
    fetchProduct,
    productInfo,
    tabData,
    isWatched,
    yieldHistory,
    isYieldHistoryLoaded,
    isYieldHistoryLoading,
    fetchYieldHistory,
    resetYieldHistory,
    updateRealtimeData
  };
});

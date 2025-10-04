import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import Decimal from 'decimal.js';
import { useLoadingStore } from './loading';
import { formatNumberWithComma } from '@/utils/numberUtils';
import { useSessionStore } from '@/stores/session.js';
import { getProductDetail, getEtfHistory } from '@/api/productApi';

export const useEtfStore = defineStore('etf', () => {
  const sessionStore = useSessionStore();

  const product = ref(null);
  const isLoading = ref(false);
  const error = ref(null);
  const loadingStore = useLoadingStore();

  const chartData = ref([]);

  // 수익률 히스토리 관련 상태
  const yieldHistory = ref(null);
  const isYieldHistoryLoaded = ref(false);
  const isYieldHistoryLoading = ref(false);

  const fetchProductDetail = async (productId, category, token) => {
    try {
      console.log(`[ETF API] ${category}/${productId} 호출`);

      const data = await getProductDetail(category, productId);
      console.log('[ETF API] 응답 데이터:', data);
      return data;
    } catch (error) {
      console.error('Product API Error:', error);
      throw error;
    }
  };

  async function fetchProduct(productId, category = 'etf', token) {
    isLoading.value = true;
    loadingStore.resetLoading();
    loadingStore.startLoading('ETF 정보를 불러오는 중...');
    error.value = null;
    const authToken = token || sessionStore.accessToken;
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
      holdingsTotalQuantity: productDetail.holdings?.holdings_total_quantity || 0,
      userWatches: productDetail.userWatches ?? false,
      yield3Months: productDetail.etfPriceSummaryDto?.percentChangeFrom3MonthsAgo ?? 0,
      currentPrice: productDetail.currentPrice ? productDetail.currentPrice.toLocaleString() : '0',
      productCompanyName: productDetail.productCompanyName,
      productName: productDetail.productName,
      productCode: productDetail.productCode || originalProductId,
      productRiskGrade: productDetail.productRiskGrade,
      etfNetAssets: productDetail.etfNetAssets
        ? `${(productDetail.etfNetAssets / 1e8).toFixed(2)}억원`
        : '-'
    };
    return result;
  };

  const generatePriceData = productDetail => {
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
    if (!yieldHistory.value || yieldHistory.value.length === 0) return [];

    const chartDataForChart = yieldHistory.value.map(item => ({
      time: Math.floor(item.timestamp / 1000),
      price: Number(item.currentPrice) || 0,
      volume: Number(item.currentVolume) || 0
    }));

    return [{ type: 'areachart', title: 'ETF 가격/거래량 그래프', desc: chartDataForChart }];
  };

  const generateInfoTab = productDetail => {
    return [
      {
        type: 'text',
        title: '상품명',
        desc: productDetail.productName
      },
      { type: 'text', title: '운용사', desc: productDetail.productCompanyName },
      {
        type: 'longtext',
        title: 'ETF 특징',
        desc: productDetail.etfFundCharacteristics
      },
      {
        type: 'longtext',
        title: '운용 전략',
        desc: productDetail.etfManagementStrategy
      },
      { type: 'text', title: '위험 등급', desc: `${productDetail.productRiskGrade}등급` },
      {
        type: 'text',
        title: '순자산 총액',
        desc: productDetail.currentAum
          ? `${(productDetail.currentAum / 1e8).toFixed(2)}억원`
          : productDetail.etfNetAssets
            ? `${(productDetail.etfNetAssets / 1e8).toFixed(2)}억원`
            : '-'
      },
      { type: 'text', title: '총보수', desc: `${productDetail.etfTotalExpenseRatio}%` },
      { type: 'text', title: '기초지수', desc: productDetail.etfBenchmarkIndex },
      {
        type: 'text',
        title: '상장일',
        desc: Array.isArray(productDetail.etfListingDate)
          ? `${productDetail.etfListingDate[0]}-${String(productDetail.etfListingDate[1]).padStart(2, '0')}-${String(productDetail.etfListingDate[2]).padStart(2, '0')}`
          : productDetail.etfListingDate
      },
      { type: 'text', title: '최소 거래 단위', desc: `${productDetail.etfMinTradingUnit}주` },
      { type: 'text', title: '과세 유형', desc: productDetail.etfTaxType }
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
                url: productDetail.etfCollectiveInvestmentAgreementUrl
              },
              {
                label: '투자설명서',
                url: productDetail.etfInvestmentProspectusUrl
              },
              {
                label: '간이투자설명서',
                url: productDetail.etfSimplifiedProspectusUrl
              }
            ]
          }
        ]
      }
    ];
  };

  const generateHoldingTab = (holdingData, productDetail) => {
    if (!holdingData) return [];

    const currentPrice = new Decimal(productDetail.currentNav ?? productDetail.currentPrice ?? 0);
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
      yield: generateYieldTab(product.value)
    };

    // 보유 수량이 있으면 보유기록 탭 추가
    if (
      product.value.isHolding &&
      (product.value.holding || product.value.holdings)?.holdingsTotalQuantity > 0
    ) {
      const holdingData = product.value.holding || product.value.holdings;
      baseTabData.holding = [
        {
          type: 'holdingsummary',
          title: '보유 현황',
          desc: holdingData.find(item => item.type === 'holdingsummary')?.desc || {}
        },
        {
          type: 'holdinghistory',
          title: '투자 기록',
          desc: holdingData.find(item => item.type === 'holdinghistory')?.desc || []
        }
      ];
    }
    return baseTabData;
  });

  const productInfo = computed(() => product.value);
  const isWatched = computed(() => {
    const watched = product.value?.userWatches ?? false;
    return watched;
  });

  const fetchYieldHistory = async (productId, token) => {
    isYieldHistoryLoaded.value = false;
    isYieldHistoryLoading.value = true;

    try {
      const data = await getEtfHistory(productId);
      yieldHistory.value = data;
      console.log('[ETF Store] Yield history fetched and updated:', data);
    } catch (error) {
      console.error('Yield History API Error:', error);
      yieldHistory.value = [];
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

  const updateRealtimeData = realtimeData => {
    if (!product.value || !realtimeData) return;

    if (realtimeData.currentPrice !== undefined && realtimeData.currentVolume !== undefined) {
      const currentTime = Date.now();

      if (!yieldHistory.value) {
        yieldHistory.value = [];
      }

      const lastData = yieldHistory.value[yieldHistory.value.length - 1];
      if (lastData && lastData.timestamp === currentTime) {
        lastData.currentPrice = realtimeData.currentPrice;
        lastData.currentVolume = realtimeData.currentVolume;
      } else {
        const newDataPoint = {
          timestamp: currentTime,
          currentPrice: realtimeData.currentPrice,
          currentVolume: realtimeData.currentVolume
        };

        yieldHistory.value.push(newDataPoint);

        if (yieldHistory.value.length > 60) {
          yieldHistory.value = yieldHistory.value.slice(-60);
        }

        yieldHistory.value.sort((a, b) => a.timestamp - b.timestamp);
      }
    }

    if (realtimeData.currentPrice !== undefined) {
      product.value.currentPrice = realtimeData.currentPrice;
    }
    if (realtimeData.currentVolume !== undefined) {
      product.value.currentVolume = realtimeData.currentVolume;
    }
    if (realtimeData.changeFromPrevDay !== undefined) {
      product.value.changeFromPrevDay = realtimeData.changeFromPrevDay;
    }
    if (realtimeData.return1Week !== undefined) {
      product.value.return1Week = realtimeData.return1Week;
    }
    if (realtimeData.return1Month !== undefined) {
      product.value.return1Month = realtimeData.return1Month;
    }
    if (realtimeData.return3Months !== undefined) {
      product.value.return3Months = realtimeData.return3Months;
    }
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

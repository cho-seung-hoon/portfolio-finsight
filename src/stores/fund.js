import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import Decimal from 'decimal.js';
import { useLoadingStore } from './loading';
import { formatNumberWithComma } from '@/utils/numberUtils';
import { useSessionStore } from '@/stores/session.js';

export const useFundStore = defineStore('fund', () => {

  const sessionStore = useSessionStore();

  const product = ref(null);
  const isLoading = ref(false);
  const error = ref(null);
  const loadingStore = useLoadingStore();

  // 수익률 히스토리 관련 상태
  const yieldHistory = ref(null);
  const isYieldHistoryLoaded = ref(false);
  const isYieldHistoryLoading = ref(false);

  const mockProductData = {
    productCode: 'fund-001',
    productName: '미래에셋자산배분TINA펀드',
    productCompanyName: '미래에셋',
    productRiskGrade: 3,
    fundCountry: 'domestic',
    fundType: 'mixed',
    fundDelistingStatus: false,
    fundFeature: '글로벌 자산에 분산 투자하여 안정적인 수익을 추구합니다.',
    fundManagementStrategy: '자산배분 전략을 통해 위험을 분산하고 안정적인 수익을 추구합니다.',
    fundFeeTotalExpenseRatio: '1.2%',
    fundFeeBackEndLoad: '0%',
    fundFeeRedemption: '0%',
    fundFeeFrontEndLoad: '0%',
    fundReportInvestment: 'https://www.miraeasset.com/report/investment.pdf',
    fundReportCollectiveInvestmentTermsUrl: 'https://www.miraeasset.com/report/collective.pdf',
    fundReportInvestmentProspectusUrl: 'https://www.miraeasset.com/report/prospectus.pdf',
    fundReportSimplidfiedProspectusUrl: 'https://www.miraeasset.com/report/simple.pdf',
    fundEstablishedDate: '2020-01-01',
    fundPriceSummaryDto: {
      currentNav: 1414.27,
      currentAum: 2.5e11,
      changeFromYesterday: 40.55,
      percentChangeFromYesterday: 2.95,
      percentChangeFrom3MonthsAgo: 25.97
    },
    fassetAllocation: [
      { fassetAllocationType: '주식', fassetAllocationPer: 60 },
      { fassetAllocationType: '채권', fassetAllocationPer: 30 },
      { fassetAllocationType: '대체투자', fassetAllocationPer: 10 }
    ],
    fstockHoldings: [
      { fstockHoldingsName: '삼성전자', fstockHoldingsPer: 5 },
      { fstockHoldingsName: 'SK하이닉스', fstockHoldingsPer: 3 }
    ],
    fundNewsResponse: [
      {
        newsId: 'news-001',
        newsTitle: '미래에셋자산배분TINA펀드, 수익률 상승',
        newsSummary: '글로벌 자산배분 펀드가 안정적인 성과를 기록하고 있습니다.',
        newsContentUrl: 'https://example.com/news/001',
        newsPublishedAt: [2024, 6, 14, 10, 0],
        newsScore: 0.85,
        newsSentiment: 'positive',
        newsPublisher: 'Bloomberg'
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

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Product API Error:', error);
      console.log('Using mock data due to API failure');

      return {
        ...mockProductData,
        productCode: productId,
        holdings: null
      };
    }
  };

  async function fetchProduct(productId, category = 'fund', token) {
    isLoading.value = true;
    loadingStore.resetLoading();
    loadingStore.startLoading('펀드 정보를 불러오는 중...');
    error.value = null;

    // 토큰이 전달되지 않았으면 sessionStore에서 가져오기
    const authToken = token || sessionStore.accessToken;

    console.log('Using token:', authToken ? 'Token exists' : 'No token');

    try {
      const productDetail = await fetchProductDetail(productId, category, authToken);
      product.value = processFundData(productDetail, productId);
    } catch (e) {
      error.value = `펀드 상품 정보를 불러오는 데 실패했습니다: ${e.message}`;
      console.error(e);
    } finally {
      isLoading.value = false;
      loadingStore.stopLoading();
    }
  }

  const fetchYieldHistory = async (productId, token) => {
    if (isYieldHistoryLoaded.value) {
      return yieldHistory.value;
    }

    isYieldHistoryLoading.value = true;
    const authToken = token || sessionStore.accessToken;

    try {
      const response = await fetch(`http://localhost:8080/fund/${productId}/history`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('수익률 히스토리를 불러오는데 실패했습니다.');
      }

      const data = await response.json();

      yieldHistory.value = data;
      isYieldHistoryLoaded.value = true;
      return data;
    } catch (error) {
      console.error('Yield History API Error:', error);
      const mockHistory = [
        { baseDate: [2025, 7, 26], fundNav: 8890.74, fundAum: 5.46473268012e11, weeklyReturn: 2.5, monthlyReturn: 8.3, quarterlyReturn: 15.7 },
        { baseDate: [2025, 7, 27], fundNav: 9003.48, fundAum: 4.95595010044e11, weeklyReturn: 2.8, monthlyReturn: 8.7, quarterlyReturn: 16.2 },
        { baseDate: [2025, 7, 28], fundNav: 8989.9, fundAum: 5.51005951576e11, weeklyReturn: 2.6, monthlyReturn: 8.5, quarterlyReturn: 15.9 },
        { baseDate: [2025, 7, 29], fundNav: 9132.97, fundAum: 5.19191373659e11, weeklyReturn: 3.1, monthlyReturn: 9.2, quarterlyReturn: 16.8 },
        { baseDate: [2025, 7, 30], fundNav: 9048.18, fundAum: 5.14413114603e11, weeklyReturn: 2.9, monthlyReturn: 8.9, quarterlyReturn: 16.4 },
        { baseDate: [2025, 7, 31], fundNav: 9216.91, fundAum: 4.91735513284e11, weeklyReturn: 3.4, monthlyReturn: 9.6, quarterlyReturn: 17.1 },
        { baseDate: [2025, 8, 1], fundNav: 9286.14, fundAum: 5.07812423849e11, weeklyReturn: 3.7, monthlyReturn: 9.9, quarterlyReturn: 17.4 },
        { baseDate: [2025, 8, 2], fundNav: 9133.04, fundAum: 4.89952020905e11, weeklyReturn: 3.2, monthlyReturn: 9.3, quarterlyReturn: 16.9 },
        { baseDate: [2025, 8, 3], fundNav: 9187.8, fundAum: 4.97378695927e11, weeklyReturn: 3.5, monthlyReturn: 9.6, quarterlyReturn: 17.2 },
        { baseDate: [2025, 8, 4], fundNav: 9225.21, fundAum: 4.53909698032e11, weeklyReturn: 3.8, monthlyReturn: 9.9, quarterlyReturn: 17.5 },
        { baseDate: [2025, 8, 5], fundNav: 9154.27, fundAum: 5.18964582114e11, weeklyReturn: 3.3, monthlyReturn: 9.4, quarterlyReturn: 17.0 },
        { baseDate: [2025, 8, 6], fundNav: 9009.25, fundAum: 4.90214161251e11, weeklyReturn: 2.7, monthlyReturn: 8.6, quarterlyReturn: 16.1 },
        { baseDate: [2025, 8, 7], fundNav: 9093.08, fundAum: 4.50370703433e11, weeklyReturn: 3.0, monthlyReturn: 8.9, quarterlyReturn: 16.6 }
      ];
      yieldHistory.value = mockHistory;
      isYieldHistoryLoaded.value = true;
      return mockHistory;
    } finally {
      isYieldHistoryLoading.value = false;
    }
  };

  const resetYieldHistory = () => {
    yieldHistory.value = null;
    isYieldHistoryLoaded.value = false;
    isYieldHistoryLoading.value = false;
  };

  const processFundData = (productDetail, originalProductId) => {
    const productId = originalProductId;

    const result = {
      ...productDetail,

      info: generateInfoTab(productDetail),
      composition: generateCompositionTab(productDetail),
      pdf: generatePdfTab(productDetail),
      news: generateNewsTab(productDetail),
      yield: generateYieldTab(productDetail, yieldHistory.value),

      holding: generateHoldingTab(productDetail.holdings, productDetail),

      price: generatePriceData(productDetail),

      isHolding: !!productDetail.holdings,
      holdingQuantity: productDetail.holdings?.holdings_total_quantity || 0,
      holdingsTotalQuantity: productDetail.holdings?.holdings_total_quantity || 0,

      isWatched: productDetail.holdings?.isWatched ?? productDetail.holdings?.is_watched ?? false,

      yield3Months: productDetail.fundPriceSummaryDto?.percentChangeFrom3MonthsAgo || 0,
      productCompanyName: productDetail.productCompanyName || '한국투자신탁운용',
      productName: productDetail.productName || '한국투자베트남그로스증권자투자신탁UH(주식)(A)',
      productCode: productDetail.productCode || productId,
      productRiskGrade: productDetail.productRiskGrade || 2,
      currentPrice: productDetail.fundPriceSummaryDto?.currentNav ?? 0,
      priceChange: productDetail.fundPriceSummaryDto?.changeFromYesterday ?? 0,
      priceChangePercent: productDetail.fundPriceSummaryDto?.percentChangeFromYesterday ?? 0
    };

    return result;
  };

  const generatePriceData = productDetail => {
    const priceSummary = productDetail.fundPriceSummaryDto;
    if (!priceSummary) {
      return {
        currentPrice: 0,
        previousPrice: 0,
        priceChange: 0,
        priceChangePercent: 0
      };
    }

    const currentNav = priceSummary.currentNav ?? 0;
    const changeFromYesterday = priceSummary.changeFromYesterday ?? 0;
    const previousNav = currentNav - changeFromYesterday;

    return {
      currentPrice: currentNav,
      previousPrice: previousNav,
      priceChange: changeFromYesterday,
      priceChangePercent: priceSummary.percentChangeFromYesterday ?? 0
    };
  };

  const generateNewsTab = productDetail => {
    const newsData = productDetail.fundNewsResponse;

    if (!newsData || !newsData.length) {
      return [];
    }

    try {
      return [
        {
          type: 'news',
          title: '펀드 관련 뉴스',
          keyword: '펀드',
          color: '#34C759',
          desc: newsData.map(news => {
            const [year, month, day, hour, minute] = news.newsPublishedAt;
            const publishedDate = new Date(year, month - 1, day, hour, minute);

            const processedNews = {
              news_id: news.newsId,
              news_title: news.newsTitle,
              news_content_url: news.newsContentUrl,
              news_published_at: publishedDate.toISOString(),
              news_score: news.newsScore / 100,
              news_sentiment: news.newsSentiment,
              news_publisher: news.newsPublisher
            };

            return processedNews;
          })
        }
      ];
    } catch (error) {
      console.error('Error processing news data:', error);
      return [];
    }
  };

  const generateYieldTab = (productDetail, history) => {
    const priceHistory = history || productDetail.priceHistory;
    if (!priceHistory || !priceHistory.length) {
      return [];
    }

    const chartData = priceHistory.map(item => {
      const date = item.baseDate
        ? `${item.baseDate[0]}-${String(item.baseDate[1]).padStart(2, '0')}-${String(item.baseDate[2]).padStart(2, '0')}`
        : item.date;
      const price = item.fundNav || item.price;
      
      let yieldValue = 0;
      if (item.weeklyReturn !== undefined) {
        yieldValue = item.weeklyReturn;
      } else if (item.monthlyReturn !== undefined) {
        yieldValue = item.monthlyReturn;
      } else if (item.quarterlyReturn !== undefined) {
        yieldValue = item.quarterlyReturn;
      } else if (item.yield !== undefined) {
        yieldValue = item.yield;
      } else {
        const firstPrice = priceHistory[0].fundNav || priceHistory[0].price;
        if (firstPrice && price !== 0) {
          yieldValue = parseFloat((((price - firstPrice) / firstPrice) * 100).toFixed(1));
        }
      }

      return {
        date: date,
        수익률: yieldValue,
        기준가: price,
        weeklyReturn: item.weeklyReturn,
        monthlyReturn: item.monthlyReturn,
        quarterlyReturn: item.quarterlyReturn,
        fundAum: item.fundAum,
        baseDate: item.baseDate
      };
    });

    return [
      {
        type: 'areachart',
        title: '수익률/기준가 추이',
        desc: chartData
      },
      {
        type: 'text',
        title: '설정일',
        desc: Array.isArray(productDetail.fundEstablishedDate)
          ? `${productDetail.fundEstablishedDate[0]}-${String(productDetail.fundEstablishedDate[1]).padStart(2, '0')}-${String(productDetail.fundEstablishedDate[2]).padStart(2, '0')}`
          : productDetail.fundEstablishedDate || '2016.02.17'
      },
      {
        type: 'text',
        title: '총보수',
        desc: productDetail.fundFeeTotalExpenseRatio || '연 1.8280%'
      },
      {
        type: 'text',
        title: '설정수수료',
        desc: productDetail.fundFeeFrontEndLoad || '납입금액의 1.000%'
      },
      { type: 'text', title: '환매수수료', desc: productDetail.fundFeeRedemption || '수수료 없음' }
    ];
  };

  const generateInfoTab = productDetail => {
    return [
      {
        type: 'text',
        title: '상품명',
        desc: productDetail.productName || '한국투자베트남그로스증권자투자신탁UH(주식)(A)'
      },
      {
        type: 'text',
        title: '운용사',
        desc: productDetail.productCompanyName || '한국투자신탁운용'
      },
      {
        type: 'longtext',
        title: '펀드 특징',
        desc:
          productDetail.fundFeature ||
          '베트남 주식시장에 상장된 주식 등에 주로 투자하여 투자대상자산의 가격상승에 따른 자본이득을 추구하는 것을 목적으로 합니다.'
      },
      {
        type: 'longtext',
        title: '운용 전략',
        desc:
          productDetail.fundManagementStrategy ||
          '베트남 주식시장에 상장된 주식에 주로 투자하고, 투자신탁재산의 일부는 국내.외 채권 및 어음 등에 투자합니다.'
      },
      { type: 'text', title: '위험 등급', desc: `${productDetail.productRiskGrade || 2}등급` },
      {
        type: 'text',
        title: '순자산 총액',
        desc: productDetail.currentAum ? `${(productDetail.currentAum / 1e8).toFixed(2)}억원` : '—'
      },
      {
        type: 'text',
        title: '총보수',
        desc: productDetail.fundFeeTotalExpenseRatio || '연 1.8280%'
      },
      {
        type: 'text',
        title: '설정수수료',
        desc: productDetail.fundFeeFrontEndLoad || '납입금액의 1.000%'
      },
      { type: 'text', title: '환매수수료', desc: productDetail.fundFeeRedemption || '수수료 없음' },
      {
        type: 'text',
        title: '설정일',
        desc: Array.isArray(productDetail.fundEstablishedDate)
          ? `${productDetail.fundEstablishedDate[0]}-${String(productDetail.fundEstablishedDate[1]).padStart(2, '0')}-${String(productDetail.fundEstablishedDate[2]).padStart(2, '0')}`
          : productDetail.fundEstablishedDate || '2016.02.17'
      }
    ];
  };

  const generateCompositionTab = productDetail => {
    const result = [];

    if (productDetail.fassetAllocation && productDetail.fassetAllocation.length > 0) {
      result.push({
        type: 'piechart',
        title: '자산 배분',
        desc: productDetail.fassetAllocation.map(item => ({
          종목명: item.fassetAllocationType,
          비중: `${item.fassetAllocationPer}%`
        }))
      });
    }

    if (productDetail.fstockHoldings && productDetail.fstockHoldings.length > 0) {
      result.push({
        type: 'table',
        title: '주식 보유',
        desc: productDetail.fstockHoldings.map(item => ({
          종목명: item.fstockHoldingsName,
          비중: `${item.fstockHoldingsPer}%`
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
                url:
                  productDetail.fundReportInvestment ||
                  'https://www.funetf.co.kr/upload/FOK/gongsi/R5_K55101B79262_20250516.pdf'
              }
            ]
          },
          {
            category: '공시문서',
            items: [
              {
                label: '집합투자규약',
                url:
                  productDetail.fundReportCollectiveInvestmentTermsUrl ||
                  'https://www.funetf.co.kr/upload/FOK/gongsi/R1_K55101B79262_20250103.pdf'
              },
              {
                label: '투자설명서',
                url:
                  productDetail.fundReportInvestmentProspectusUrl ||
                  'https://www.funetf.co.kr/upload/FOK/gongsi/R2_K55101B79262_20250424.pdf'
              },
              {
                label: '간이투자설명서',
                url:
                  productDetail.fundReportSimplidfiedProspectusUrl ||
                  'https://www.funetf.co.kr/upload/FOK/gongsi/R3_K55101B79262_20250424.pdf'
              }
            ]
          }
        ]
      }
    ];
  };

  const generateHoldingTab = (holdingData, productDetail) => {
    if (!holdingData) {
      return [];
    }

    const currentPrice = new Decimal(
      productDetail.fundPriceSummaryDto?.currentNav ??
        productDetail.fundPriceSummaryDto?.current_nav ??
        0
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
            const isBuy = item.historyTradeType === 'buy';

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
            const seconds = tradeDate.getSeconds();
            const ampm = hours < 12 ? '오전' : '오후';
            const displayHours = String(hours < 12 ? hours : hours - 12).padStart(2, '0');
            const displayDate = `${year}/${month}/${day} ${ampm} ${displayHours}:${minutes}:${seconds}`;

            return {
              ...item,
              historyQuantity: item.historyQuantity,
              historyAmount: item.historyAmount,
              historyTradeDate: item.historyTradeDate,
              displayQuantity,
              displayAmount,
              displayDate,
              isSell,
              isBuy,
              quantityColor: isSell ? '#FF3B30' : '#007AFF',
              amountColor: isSell ? '#FF3B30' : '#007AFF'
            };
          }) || []
      });
    }

    return result;
  };

  const productInfo = computed(() => product.value);

  const isWatched = computed(() => {
    const watched = product.value?.isWatched || false;
    return watched;
  });

  const tabs = computed(() => {
    const hasValidHoldings = productInfo.value?.isHolding &&
      (productInfo.value?.holdings || productInfo.value?.holding) &&
      (productInfo.value?.holdings?.holdingsTotalQuantity > 0 || productInfo.value?.holding?.holdingsTotalQuantity > 0) &&
      (productInfo.value?.holdings?.holdingsStatus !== 'zero' || productInfo.value?.holding?.holdingsStatus !== 'zero');
    
    if (hasValidHoldings) {
      return [
        { key: 'holding', label: '보유기록' },
        { key: 'info', label: '상품안내' },
        { key: 'yield', label: '수익률' },
        { key: 'composition', label: '구성종목' },
        { key: 'news', label: '뉴스' }
      ];
    }
    return [
      { key: 'info', label: '상품안내' },
      { key: 'yield', label: '수익률' },
      { key: 'composition', label: '구성종목' },
      { key: 'news', label: '뉴스' }
    ];
  });

  return {
    product,
    isLoading,
    error,
    fetchProduct,
    productInfo,
    isWatched,
    yieldHistory,
    isYieldHistoryLoaded,
    isYieldHistoryLoading,
    fetchYieldHistory,
    resetYieldHistory,
    generateYieldTab,
    generateHoldingTab,
    generateInfoTab,
    generateCompositionTab,
    generatePdfTab,
    generateNewsTab
  };
});

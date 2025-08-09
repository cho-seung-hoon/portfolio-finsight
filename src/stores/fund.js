import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import Decimal from 'decimal.js';
import { useLoadingStore } from './loading';
import { formatNumberWithComma } from '@/utils/numberUtils';

export const useFundStore = defineStore('fund', () => {
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
      current_nav: 1414.27,
      current_aum: 2.5e11,
      change_from_yesterday: 40.55,
      percent_change_from_yesterday: 2.95,
      percent_change_from_3_months_ago: 25.97
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
      console.log('News data in API response:', data.fundNewsResponse);
      return data;
    } catch (error) {
      console.error('Product API Error:', error);
      console.log('Using mock data due to API failure');

      // API 호출 실패 시 Mock 데이터 반환
      return {
        ...mockProductData,
        productCode: productId,
        holdings: null
      };
    }
  };

  // Actions - fetchProduct 함수 수정
  async function fetchProduct(productId, category = 'fund', token) {
    isLoading.value = true;
    loadingStore.resetLoading();
    loadingStore.startLoading('펀드 정보를 불러오는 중...');
    error.value = null;

    // 토큰이 전달되지 않았으면 localStorage에서 가져오기
    const authToken = token || localStorage.getItem('accessToken');

    console.log('Using token:', authToken ? 'Token exists' : 'No token');

    try {
      // 하나의 API로 모든 정보 가져오기
      const productDetail = await fetchProductDetail(productId, category, authToken);

      // 데이터 가공
      product.value = processFundData(productDetail, productId);
    } catch (e) {
      error.value = `펀드 상품 정보를 불러오는 데 실패했습니다: ${e.message}`;
      console.error(e);
    } finally {
      isLoading.value = false;
      loadingStore.stopLoading();
    }
  }

  // 수익률 히스토리 API 호출 함수
  const fetchYieldHistory = async (productId, token) => {
    // 이미 로드된 경우 다시 호출하지 않음
    if (isYieldHistoryLoaded.value) {
      return yieldHistory.value;
    }

    isYieldHistoryLoading.value = true;
    const authToken = token || localStorage.getItem('accessToken');

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
      console.log('Yield History API Response:', data);

      yieldHistory.value = data;
      isYieldHistoryLoaded.value = true;
      return data;
    } catch (error) {
      console.error('Yield History API Error:', error);
      // API 실패 시 Mock 데이터 반환
      const mockHistory = [
        { baseDate: [2025, 7, 1], fundNav: 9080.36, fundAum: 2.68993648307e11 },
        { baseDate: [2025, 7, 2], fundNav: 9036.5, fundAum: 2.80791060298e11 },
        { baseDate: [2025, 7, 3], fundNav: 8900.64, fundAum: 2.85558763133e11 },
        { baseDate: [2025, 7, 4], fundNav: 8891.4, fundAum: 3.12955027586e11 },
        { baseDate: [2025, 7, 5], fundNav: 8983.97, fundAum: 3.21564874004e11 },
        { baseDate: [2025, 7, 6], fundNav: 8880.65, fundAum: 3.41157953676e11 },
        { baseDate: [2025, 7, 7], fundNav: 9007.37, fundAum: 3.45245306456e11 },
        { baseDate: [2025, 7, 8], fundNav: 9072.73, fundAum: 3.25566634747e11 },
        { baseDate: [2025, 7, 9], fundNav: 8998.75, fundAum: 3.60726050177e11 },
        { baseDate: [2025, 7, 10], fundNav: 9137.33, fundAum: 4.14559054539e11 },
        { baseDate: [2025, 7, 11], fundNav: 9142.61, fundAum: 4.06269478975e11 },
        { baseDate: [2025, 7, 12], fundNav: 8960.09, fundAum: 3.77630324171e11 },
        { baseDate: [2025, 7, 13], fundNav: 9012.92, fundAum: 3.86486491275e11 },
        { baseDate: [2025, 7, 14], fundNav: 8970.37, fundAum: 3.57937695826e11 },
        { baseDate: [2025, 7, 15], fundNav: 8814.75, fundAum: 3.91411988802e11 },
        { baseDate: [2025, 7, 16], fundNav: 8702.45, fundAum: 4.01143440857e11 },
        { baseDate: [2025, 7, 17], fundNav: 8698.79, fundAum: 4.56891361098e11 },
        { baseDate: [2025, 7, 18], fundNav: 8843.08, fundAum: 4.90183132958e11 },
        { baseDate: [2025, 7, 19], fundNav: 8886.53, fundAum: 4.79498046897e11 },
        { baseDate: [2025, 7, 20], fundNav: 8796.34, fundAum: 5.00668689933e11 },
        { baseDate: [2025, 7, 21], fundNav: 8788.58, fundAum: 4.85183914248e11 },
        { baseDate: [2025, 7, 22], fundNav: 8786.71, fundAum: 4.60855677871e11 },
        { baseDate: [2025, 7, 23], fundNav: 8889.79, fundAum: 5.29954924452e11 },
        { baseDate: [2025, 7, 24], fundNav: 8851.59, fundAum: 4.96418851018e11 },
        { baseDate: [2025, 7, 25], fundNav: 8770.82, fundAum: 4.75255925741e11 },
        { baseDate: [2025, 7, 26], fundNav: 8890.74, fundAum: 5.46473268012e11 },
        { baseDate: [2025, 7, 27], fundNav: 9003.48, fundAum: 4.95595010044e11 },
        { baseDate: [2025, 7, 28], fundNav: 8989.9, fundAum: 5.51005951576e11 },
        { baseDate: [2025, 7, 29], fundNav: 9132.97, fundAum: 5.19191373659e11 },
        { baseDate: [2025, 7, 30], fundNav: 9048.18, fundAum: 5.14413114603e11 },
        { baseDate: [2025, 7, 31], fundNav: 9216.91, fundAum: 4.91735513284e11 },
        { baseDate: [2025, 8, 1], fundNav: 9286.14, fundAum: 5.07812423849e11 },
        { baseDate: [2025, 8, 2], fundNav: 9133.04, fundAum: 4.89952020905e11 },
        { baseDate: [2025, 8, 3], fundNav: 9187.8, fundAum: 4.97378695927e11 },
        { baseDate: [2025, 8, 4], fundNav: 9225.21, fundAum: 4.53909698032e11 },
        { baseDate: [2025, 8, 5], fundNav: 9154.27, fundAum: 5.18964582114e11 },
        { baseDate: [2025, 8, 6], fundNav: 9009.25, fundAum: 4.90214161251e11 },
        { baseDate: [2025, 8, 7], fundNav: 9093.08, fundAum: 4.50370703433e11 }
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

  // 펀드 데이터 가공 함수
  const processFundData = (productDetail, originalProductId) => {
    console.log('processFundData - productDetail:', productDetail);

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
        console.log('Processing news data in processFundData');
        const newsData = generateNewsTab(productDetail);
        console.log('Generated news data:', newsData);
        return newsData;
      })(),

      // 보유 내역 데이터 가공 (API 응답에서)
      holding: generateHoldingTab(productDetail.holdings, productDetail),

      // 시세 데이터 가공
      price: generatePriceData(productDetail),

      // 보유 여부 판단
      isHolding: !!productDetail.holdings,
      holdingQuantity: productDetail.holdings?.holdings_total_quantity || 0,

      // 찜 여부 판단
      isWatched: productDetail.holdings?.is_watched || false,

      // DetailMainFund 컴포넌트용 데이터
      yield: productDetail.fundPriceSummaryDto?.percent_change_from_3_months_ago || 0,
      priceArr: generatePriceArray(productDetail),
      productCompanyName: productDetail.productCompanyName || '한국투자신탁운용',
      productName: productDetail.productName || '한국투자베트남그로스증권자투자신탁UH(주식)(A)',
      productCode: productDetail.productCode || productId,
      productRiskGrade: productDetail.productRiskGrade || 2,
      // 현재가와 전일대비 정보 추가
      currentPrice: productDetail.fundPriceSummaryDto?.current_nav || 0,
      priceChange: productDetail.fundPriceSummaryDto?.change_from_yesterday || 0,
      priceChangePercent: productDetail.fundPriceSummaryDto?.percent_change_from_yesterday || 0
    };

    console.log('Final processed Fund data:', result);
    return result;
  };

  // 기준가 배열 생성 함수 (API에서 계산된 값 사용)
  const generatePriceArray = productDetail => {
    const priceSummary = productDetail.fundPriceSummaryDto;
    if (!priceSummary) {
      return [0, 0];
    }

    const currentNav = priceSummary.current_nav || 0;
    const changeFromYesterday = priceSummary.change_from_yesterday || 0;
    const previousNav = currentNav - changeFromYesterday;

    return [currentNav, previousNav];
  };

  // 시세 데이터 가공 함수
  const generatePriceData = productDetail => {
    const priceSummary = productDetail.fundPriceSummaryDto;
    if (!priceSummary) {
      return {
        currentPrice: 0,
        previousPrice: 0,
        priceChange: 0,
        priceChangePercent: 0,
        priceArr: [new Decimal(0), new Decimal(0)]
      };
    }

    const currentNav = priceSummary.current_nav || 0;
    const changeFromYesterday = priceSummary.change_from_yesterday || 0;
    const previousNav = currentNav - changeFromYesterday;

    return {
      currentPrice: currentNav,
      previousPrice: previousNav,
      priceChange: changeFromYesterday,
      priceChangePercent: priceSummary.percent_change_from_yesterday || 0,
      priceArr: [new Decimal(currentNav), new Decimal(previousNav)]
    };
  };

  // 뉴스 데이터 가공 함수
  const generateNewsTab = productDetail => {
    console.log('generateNewsTab - productDetail:', productDetail);
    const newsData = productDetail.fundNewsResponse;
    console.log('generateNewsTab - newsData:', newsData);

    if (!newsData || !newsData.length) {
      console.log('No news data available');
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
            console.log('Processing news item:', news);

            // 날짜 배열을 Date 객체로 변환
            const [year, month, day, hour, minute] = news.newsPublishedAt;
            const publishedDate = new Date(year, month - 1, day, hour, minute);

            // DetailNewsList.vue 형식에 맞춰 데이터 변환
            const processedNews = {
              news_id: news.newsId,
              news_title: news.newsTitle,
              news_content_url: news.newsContentUrl,
              news_published_at: publishedDate.toISOString(),
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

  // 수익률 데이터 가공 함수
  const generateYieldTab = productDetail => {
    // 실제 API에서 받아온 히스토리 데이터 사용 (fallback 추가)
    const priceHistory = yieldHistory.value || productDetail.priceHistory;
    if (!priceHistory || !priceHistory.length) {
      return [];
    }

    // 새로운 데이터 구조에 맞게 처리 (baseDate, fundNav)
    const chartData = priceHistory.map(item => {
      const date = item.baseDate
        ? `${item.baseDate[0]}-${String(item.baseDate[1]).padStart(2, '0')}-${String(item.baseDate[2]).padStart(2, '0')}`
        : item.date;
      const price = item.fundNav || item.price;
      const firstPrice = priceHistory[0].fundNav || priceHistory[0].price;
      const yieldValue =
        item.yield || parseFloat((((price - firstPrice) / firstPrice) * 100).toFixed(1));

      return {
        date: date,
        수익률: yieldValue,
        기준가: price
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

  // 정보 탭 생성 함수
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

  // 구성 탭 생성 함수
  const generateCompositionTab = productDetail => {
    const result = [];

    // 자산 배분 정보
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

    // 주식 보유 정보
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

  // PDF 탭 생성 함수
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

  // 보유 내역 탭 생성 함수
  const generateHoldingTab = (holdingData, productDetail) => {
    console.log('generateHoldingTab - holdingData:', holdingData);

    if (!holdingData) {
      console.log('No holding data available');
      return [];
    }

    // 현재 시세로 평가액 계산 (Decimal 사용)
    const currentPrice = new Decimal(productDetail.fundPriceSummaryDto?.current_nav || 0);
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
      price: generateYieldTab(product.value),
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
    resetYieldHistory
  };
});

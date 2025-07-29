import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import Decimal from 'decimal.js';

// ETF 상품 관련 상태 및 로직을 관리하는 Pinia 스토어
// 실제 API 연동 전까지 mock 데이터로 동작
export const useEtfStore = defineStore('etf', () => {
  // State
  const product = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  // 여러 목업 상품 데이터
  const mockProducts = {
    'etf-001': {
      mainYield: { value: 2.5, months: 1 }, // 수익률 (개월 수와 값)
      productCode: 'etf-001',
      productName: 'TIGER 미국S&P500',
      productCompanyName: 'TIGER',
      productRiskGrade: 4,
      etfCountry: 'foreign',
      etfType: 'equity',
      etfDelistingStatus: false,
      etfNetAssets: '25.23',
      etfFundCharacteristics: 'S&P500 지수를 추종하는 대표적인 ETF 상품',
      etfManagementStrategy:
        '이 펀드는 S&P500 지수의 수익률을 최대한 근접하게 추종하는 것을 목표로 하며, 분산 투자와 저비용 운용을 통해 안정적인 성과를 추구합니다.',
      etfTotalExpenseRatio: '0.09%',
      etfCollectiveInvestmentAgreementUrl: 'https://www.samsungfund.com/docs/rule.pdf',
      etfInvestmentProspectusUrl: 'https://www.samsungfund.com/docs/desc.pdf',
      etfSimplifiedProspectusUrl: 'https://www.samsungfund.com/docs/simple.pdf',
      etfBenchmarkIndex: 'S&P500',
      etfAssetAllocation: [
        { 종목명: '애플', 비중: '7.2%' },
        { 종목명: '마이크로소프트', 비중: '6.5%' },
        { 종목명: '아마존', 비중: '3.8%' },
        { 종목명: '엔비디아', 비중: '3.2%' },
        { 종목명: '기타', 비중: '79.3%' }
      ],
      etfEquityRatio: '100%',
      etfConstituentStocks: [
        { 종목명: '애플', 비중: '7.2%' },
        { 종목명: '마이크로소프트', 비중: '6.5%' },
        { 종목명: '아마존', 비중: '3.8%' },
        { 종목명: '엔비디아', 비중: '3.2%' },
        { 종목명: '기타', 비중: '79.3%' }
      ],
      etfListingDate: '2010-10-14',
      etfMinTradingUnit: 1,
      etfTaxType: '배당소득세',
      currentPrice: '15,000', // 현재 시세
      price: new Decimal(15000), // 매수/매도용 가격
      isHolding: false,
      holdingQuantity: 0, // 보유 수량
      info: [
        { type: 'longtext', title: '펀드 특징', desc: 'S&P500 지수를 추종하는 대표적인 ETF 상품' },
        {
          type: 'longtext',
          title: '운용 전략',
          desc: '이 펀드는 S&P500 지수의 수익률을 최대한 근접이 펀드는 S&P500 지수의 수익률을 최대한 근접하게 추종하는 것을 목표로 하며, 분산 투자와 저비용 운용을 통해 안정적인 성과를 추구합니다.이 펀드는 S&P500 지수의 수익률을 최대한 근접하게 추종하는 것을 목표로 하며, 분산 투자와 저비용 운용을 통해 안정적인 성과를 추구합니다.이 펀드는 S&P500 지수의 수익률을 최대한 근접하게 추종하는 것을 목표로 하며, 분산 투자와 저비용 운용을 통해 안정적인 성과를 추구합니다.이 펀드는 S&P500 지수의 수익률을 최대한 근접하게 추종하는 것을 목표로 하며, 분산 투자와 저비용 운용을 통해 안정적인 성과를 추구합니다.이 펀드는 S&P500 지수의 수익률을 최대한 근접하게 추종하는 것을 목표로 하며, 분산 투자와 저비용 운용을 통해 안정적인 성과를 추구합니다.이 펀드는 S&P500 지수의 수익률을 최대한 근접하게 추종하는 것을 목표로 하며, 분산 투자와 저비용 운용을 통해 안정적인 성과를 추구합니다.하게 추종하는 것을 목표로 하며, 분산 투자와 저비용 운용을 통해 안정적인 성과를 추구합니다.\n이 펀드는 S&P500 지수의 수익률을 최대한 근접하게 추종하는 것을 목표로 하며, 분산 투자와 저비용 운용을 통해 안정적인 성과를 추구합니다.'
        },
        { type: 'text', title: '운용사', desc: '미래에셋자산운용' },
        { type: 'text', title: '상장일', desc: '2010-10-14' },
        { type: 'text', title: '총보수', desc: '0.09%' },
        { type: 'text', title: '기초지수', desc: 'S&P500' },
        { type: 'text', title: '순자산 총액', desc: '25.23억원' },
        { type: 'text', title: '위험 등급', desc: '4등급' },
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
                { label: '집합투자규약', url: 'https://www.samsungfund.com/docs/rule.pdf' },
                { label: '투자설명서', url: 'https://www.samsungfund.com/docs/desc.pdf' },
                { label: '간이투자설명서', url: 'https://www.samsungfund.com/docs/simple.pdf' }
              ]
            }
          ]
        }
      ],
      yield: [
        {
          type: 'areachart',
          title: '수익률/기준가 추이',
          desc: [
            { date: '2024-06-01', 수익률: 1.2, 기준가: 1000 },
            { date: '2024-06-02', 수익률: 1.5, 기준가: 1010 },
            { date: '2024-06-03', 수익률: 1.7, 기준가: 1020 },
            { date: '2024-06-04', 수익률: 2.0, 기준가: 1040 },
            { date: '2024-06-05', 수익률: 2.3, 기준가: 1055 },
            { date: '2024-06-06', 수익률: 2.1, 기준가: 1048 },
            { date: '2024-06-07', 수익률: 2.3, 기준가: 1060 },
            { date: '2024-06-08', 수익률: 2.2, 기준가: 1030 },
            { date: '2024-06-09', 수익률: 2.5, 기준가: 1065 },
            { date: '2024-06-10', 수익률: 2.1, 기준가: 1020 },
            { date: '2024-06-11', 수익률: 2.8, 기준가: 1010 },
            { date: '2024-06-12', 수익률: 2.7, 기준가: 1040 },
            { date: '2024-06-13', 수익률: 3.5, 기준가: 1050 },
            { date: '2024-06-14', 수익률: 1.5, 기준가: 1060 }
          ]
        },
        { type: 'text', title: '상장일', desc: '2010-10-14' },
        { type: 'text', title: '총보수', desc: '0.09%' },
        { type: 'text', title: '기초지수', desc: 'S&P500' }
      ],
      composition: [
        {
          type: 'piechart',
          title: '구성종목',
          desc: [
            { 종목명: '애플', 비중: '7.2%' },
            { 종목명: '마이크로소프트', 비중: '6.5%' },
            { 종목명: '아마존', 비중: '3.8%' },
            { 종목명: '엔비디아', 비중: '3.2%' },
            { 종목명: '기타', 비중: '79.3%' }
          ]
        },
        {
          type: 'table',
          title: '보유비중',
          desc: [
            { 종목명: '애플', 비중: '7.2%' },
            { 종목명: '마이크로소프트', 비중: '6.5%' },
            { 종목명: '아마존', 비중: '3.8%' },
            { 종목명: '엔비디아', 비중: '3.2%' },
            { 종목명: '기타', 비중: '79.3%' }
          ]
        }
      ],
      news: [
        {
          type: 'news',
          title: 'ETF 관련 뉴스',
          keyword: 'ETF',
          color: '#007AFF',
          desc: [
            {
              title: '미국 S&P500 ETF, 최근 1년간 12% 상승',
              content_url: 'https://example.com/news1',
              published_at: '2025.01.15',
              labels: ['ETF', 'S&P500', '미국']
            },
            {
              title: '미래에셋, ETF 운용자산 10조 돌파',
              content_url: 'https://example.com/news2',
              published_at: '2025.01.14',
              labels: ['ETF', '미래에셋', '운용자산']
            },
            {
              title: 'TIGER ETF, 글로벌 투자자들의 관심 집중',
              content_url: 'https://example.com/news3',
              published_at: '2025.01.13',
              labels: ['ETF', 'TIGER', '글로벌투자']
            }
          ]
        }
      ]
    },
    'etf-002': {
      mainYield: { value: -1.8, months: 3 }, // 수익률 (개월 수와 값)
      productCode: 'etf-002',
      productName: 'KODEX 200',
      productCompanyName: 'KODEX',
      productRiskGrade: 3,
      etfCountry: 'domestic',
      etfType: 'equity',
      etfDelistingStatus: false,
      etfNetAssets: '50.00',
      etfFundCharacteristics: '코스피 200 지수를 추종하는 ETF',
      etfManagementStrategy: '코스피 200 지수의 수익률을 추종하는 것을 목표로 합니다.',
      etfTotalExpenseRatio: '0.05%',
      etfCollectiveInvestmentAgreementUrl: 'https://www.kodex.com/docs/rule.pdf',
      etfInvestmentProspectusUrl: 'https://www.kodex.com/docs/desc.pdf',
      etfSimplifiedProspectusUrl: 'https://www.kodex.com/docs/simple.pdf',
      etfBenchmarkIndex: 'KOSPI 200',
      etfAssetAllocation: [
        { 종목명: '삼성전자', 비중: '20%' },
        { 종목명: 'SK하이닉스', 비중: '10%' },
        { 종목명: '기타', 비중: '70%' }
      ],
      etfEquityRatio: '100%',
      etfConstituentStocks: [
        { 종목명: '삼성전자', 비중: '20%' },
        { 종목명: 'SK하이닉스', 비중: '10%' }
      ],
      etfListingDate: '2010-01-01',
      etfMinTradingUnit: 1,
      etfTaxType: '배당소득세',
      currentPrice: '12,500', // 현재 시세
      price: new Decimal(12500), // 매수/매도용 가격
      isHolding: true,
      holdingQuantity: 150, // 보유 수량
      info: [
        { type: 'text', title: '펀드 특징', desc: '코스피 200 지수를 추종하는 ETF' },
        { type: 'text', title: '순자산 총액', desc: '50.00억원' },
        { type: 'text', title: '위험 등급', desc: '3등급' }
      ],
      yield: [],
      composition: [
        {
          type: 'table',
          title: '구성종목',
          desc: [
            { 종목명: '삼성전자', 비중: '20%' },
            { 종목명: 'SK하이닉스', 비중: '10%' }
          ]
        }
      ],
      news: [
        {
          type: 'news',
          title: 'KODEX 관련 뉴스',
          keyword: 'KODEX',
          color: '#FF6B35',
          desc: [
            {
              title: 'KODEX 200, 안정적인 수익률 기록',
              content_url: 'https://example.com/news4',
              published_at: '2025.01.15',
              labels: ['KODEX', '수익률', '안정성']
            },
            {
              title: 'KODEX ETF, 국내 투자자 선호도 상승',
              content_url: 'https://example.com/news5',
              published_at: '2025.01.14',
              labels: ['KODEX', '투자자', '선호도']
            },
            {
              title: 'KODEX 200 지수, 코스피 대비 우수한 성과',
              content_url: 'https://example.com/news6',
              published_at: '2025.01.13',
              labels: ['KODEX', '지수', '성과']
            }
          ]
        }
      ]
    }
  };

  // 보유 내역 더미 데이터
  const mockHoldingData = {
    'etf-002': {
      holdingsId: 'holding-etf-002',
      userId: 'user123',
      productCode: 'etf-002',
      productCategory: 'etf',
      holdingsTotalPrice: new Decimal(1500000), // 150만원
      holdingsTotalQuantity: new Decimal(150), // 150좌
      holdingsStatus: 'holding',
      currentPricePerUnit: new Decimal(10000), // 1좌당 1만원
      currentTotalValue: new Decimal(1500000), // 현재 평가액
      investmentHistory: [
        {
          historyId: 'history-001',
          holdingsId: 'holding-etf-002',
          historyTradeType: 'buy',
          historyTradeDate: '2025.01.10',
          historyQuantity: new Decimal(100), // 100좌 매수
          historyAmount: new Decimal(950000)
        },
        {
          historyId: 'history-002',
          holdingsId: 'holding-etf-002',
          historyTradeType: 'buy',
          historyTradeDate: '2025.02.15',
          historyQuantity: new Decimal(50), // 50좌 추가 매수
          historyAmount: new Decimal(550000)
        }
      ]
    }
  };

  // Actions
  async function fetchProduct(productId) {
    isLoading.value = true;
    error.value = null;
    try {
      // 실제 API 호출 시 아래 코드 사용
      // const response = await fetchEtfProduct(productId);
      // product.value = response.data;

      // Mock API 호출 (0.2초 딜레이)
      await new Promise(resolve => setTimeout(resolve, 200));
      if (mockProducts[productId]) {
        product.value = mockProducts[productId];
      } else {
        throw new Error('상품을 찾을 수 없습니다.');
      }
    } catch (e) {
      error.value = `ETF 상품 정보를 불러오는 데 실패했습니다: ${e.message}`;
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  }

  // Getters
  const productInfo = computed(() => product.value);
  const tabData = computed(() => {
    if (!product.value) return {};

    const baseTabData = {
      info: product.value.info,
      yield: product.value.yield,
      composition: product.value.composition,
      news: product.value.news
    };

    return baseTabData;
  });

  // 보유 내역 데이터 getter (기존 유지)
  const holdingData = computed(() => {
    if (!product.value) return null;
    return mockHoldingData[product.value.productCode] || null;
  });

  // tabData에 holding 데이터를 추가하는 함수
  const getTabDataWithHolding = productId => {
    const baseTabData = {
      info: product.value?.info || [],
      yield: product.value?.yield || [],
      composition: product.value?.composition || [],
      news: product.value?.news || []
    };

    // 보유 중인 상품이면 holding 데이터 추가
    if (
      product.value?.isHolding &&
      product.value?.productCode &&
      mockHoldingData[product.value.productCode]
    ) {
      const holdingInfo = mockHoldingData[product.value.productCode];
      baseTabData.holding = [
        {
          type: 'holdingsummary',
          title: '보유 현황',
          desc: {
            holdingsTotalPrice: holdingInfo.holdingsTotalPrice,
            holdingsTotalQuantity: holdingInfo.holdingsTotalQuantity,
            currentPricePerUnit: holdingInfo.currentPricePerUnit,
            currentTotalValue: holdingInfo.currentTotalValue
          }
        },
        {
          type: 'holdinghistory',
          title: '투자 기록',
          desc: holdingInfo.investmentHistory
        }
      ];
    }

    return baseTabData;
  };

  return {
    product,
    isLoading,
    error,
    fetchProduct,
    productInfo,
    tabData,
    holdingData,
    getTabDataWithHolding
  };
});

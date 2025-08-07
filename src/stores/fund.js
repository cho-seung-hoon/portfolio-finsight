import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import Decimal from 'decimal.js';
import { useLoadingStore } from './loading';

export const useFundStore = defineStore('fund', () => {
  const product = ref(null);
  const isLoading = ref(false);
  const error = ref(null);
  const loadingStore = useLoadingStore();

  const mockProducts = {
    'fund-001': {
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
      fundAssetAllocation: [
        { 종목명: '주식', 비중: '60%' },
        { 종목명: '채권', 비중: '30%' },
        { 종목명: '대체투자', 비중: '10%' }
      ],
      fundStockHoldings: [
        { 종목명: '삼성전자', 비중: '5%' },
        { 종목명: 'SK하이닉스', 비중: '3%' }
      ],
      fundEstablishedDate: '2020-01-01',
      yield: 25.97, // 수익률 (3개월 고정)
      priceArr: [new Decimal(1414.27), new Decimal(1373.72)], // [오늘 기준가, 전일 기준가]
      price: new Decimal(1414.27), // 매수/매도용 가격
      isHolding: false,
      holdingQuantity: 0, // 보유 수량
      info: [
        {
          type: 'longtext',
          title: '펀드 특징',
          desc: '글로벌 자산에 분산 투자하여 안정적인 수익을 추구합니다.'
        }
      ],
      composition: [
        {
          type: 'piechart',
          title: '구성종목',
          desc: [
            { 종목명: '주식', 비중: '60%' },
            { 종목명: '채권', 비중: '30%' },
            { 종목명: '대체투자', 비중: '10%' }
          ]
        }
      ],
      news: [
        {
          type: 'news',
          title: '펀드 관련 뉴스',
          keyword: '펀드',
          color: '#34C759',
          desc: [
            {
              title: '미래에셋자산배분TINA펀드, 수익률 상승',
              content_url: 'https://example.com/news7',
              published_at: '2025.01.15',
              labels: ['펀드', '미래에셋', '수익률']
            },
            {
              title: '글로벌 자산배분 펀드, 안정적 성과 기록',
              content_url: 'https://example.com/news8',
              published_at: '2025.01.14',
              labels: ['펀드', '자산배분', '성과']
            },
            {
              title: 'TINA 펀드, 투자자 관심도 증가',
              content_url: 'https://example.com/news9',
              published_at: '2025.01.13',
              labels: ['펀드', 'TINA', '투자자']
            }
          ]
        }
      ]
    },
    'fund-002': {
      productCode: 'fund-002',
      productName: '삼성 한국형TDF 2045',
      productCompanyName: '삼성',
      productRiskGrade: 4,
      fundCountry: 'domestic',
      fundType: 'mixed',
      fundDelistingStatus: false,
      fundFeature: '은퇴 시점에 맞춰 자산 배분을 자동으로 조절하는 펀드입니다.',
      fundManagementStrategy:
        '2045년 은퇴를 목표로 하는 투자자에게 적합한 자산배분 전략을 제공합니다.',
      fundFeeTotalExpenseRatio: '1.5%',
      fundFeeBackEndLoad: '0%',
      fundFeeRedemption: '0%',
      fundFeeFrontEndLoad: '0%',
      fundReportInvestment: 'https://www.samsungfund.com/report/investment.pdf',
      fundReportCollectiveInvestmentTermsUrl: 'https://www.samsungfund.com/report/collective.pdf',
      fundReportInvestmentProspectusUrl: 'https://www.samsungfund.com/report/prospectus.pdf',
      fundReportSimplidfiedProspectusUrl: 'https://www.samsungfund.com/report/simple.pdf',
      fundAssetAllocation: [
        { 종목명: '국내주식', 비중: '40%' },
        { 종목명: '해외주식', 비중: '30%' },
        { 종목명: '채권', 비중: '30%' }
      ],
      fundStockHoldings: [
        { 종목명: '삼성전자', 비중: '8%' },
        { 종목명: 'SK하이닉스', 비중: '4%' }
      ],
      fundEstablishedDate: '2020-06-01',
      yield: -3.21, // 수익률 (3개월 고정)
      priceArr: [new Decimal(987.65), new Decimal(1000.0)], // [오늘 기준가, 전일 기준가]
      price: new Decimal(987.65), // 매수/매도용 가격
      isHolding: true,
      holdingQuantity: 2000, // 보유 수량
      info: [
        {
          type: 'longtext',
          title: '펀드 특징',
          desc: '은퇴 시점에 맞춰 자산 배분을 자동으로 조절하는 펀드입니다.'
        }
      ],
      composition: [
        {
          type: 'piechart',
          title: '구성종목',
          desc: [
            { 종목명: '국내주식', 비중: '40%' },
            { 종목명: '해외주식', 비중: '30%' },
            { 종목명: '채권', 비중: '30%' }
          ]
        }
      ],
      news: [
        {
          type: 'news',
          title: 'TDF 관련 뉴스',
          keyword: 'TDF',
          color: '#AF52DE',
          desc: [
            {
              title: '삼성 한국형TDF, 안정적인 운용 성과',
              content_url: 'https://example.com/news10',
              published_at: '2025.01.15',
              labels: ['TDF', '삼성', '운용성과']
            },
            {
              title: 'TDF 펀드, 은퇴 준비 투자자들 선호',
              content_url: 'https://example.com/news11',
              published_at: '2025.01.14',
              labels: ['TDF', '은퇴준비', '투자자']
            },
            {
              title: '한국형TDF, 자산배분 전략으로 안정성 확보',
              content_url: 'https://example.com/news12',
              published_at: '2025.01.13',
              labels: ['TDF', '자산배분', '안정성']
            }
          ]
        }
      ]
    }
  };

  // 보유 내역 더미 데이터
  const mockHoldingData = {
    'fund-002': {
      holdingsId: 'holding-fund-002',
      userId: 'user123',
      productCode: 'fund-002',
      productCategory: 'fund',
      holdingsTotalPrice: new Decimal(2000000), // 200만원
      holdingsTotalQuantity: new Decimal(2000), // 2000좌
      holdingsStatus: 'holding',
      currentPricePerUnit: new Decimal(987.65), // 현재 기준가
      currentTotalValue: new Decimal(1975300), // 현재 평가액 (2000 * 987.65)
      investmentHistory: [
        {
          historyId: 'history-001',
          holdingsId: 'holding-fund-002',
          historyTradeType: 'buy',
          historyTradeDate: '2025.01.05',
          historyQuantity: new Decimal(1200), // 1200좌 매수
          historyAmount: new Decimal(1200000)
        },
        {
          historyId: 'history-002',
          holdingsId: 'holding-fund-002',
          historyTradeType: 'buy',
          historyTradeDate: '2025.02.10',
          historyQuantity: new Decimal(800), // 800좌
          historyAmount: new Decimal(800000)
        }
      ]
    }
  };

  async function fetchProduct(productId) {
    isLoading.value = true;
    // 로딩 상태 초기화
    loadingStore.resetLoading();
    loadingStore.startLoading('펀드 정보를 불러오는 중...');
    error.value = null;
    try {
      // 0.5초 대기 (더미 데이터 로딩 시뮬레이션)
      await new Promise(resolve => setTimeout(resolve, 500));
      if (mockProducts[productId]) {
        product.value = mockProducts[productId];
      } else {
        throw new Error('상품을 찾을 수 없습니다.');
      }
    } catch (e) {
      error.value = `펀드 상품 정보를 불러오는 데 실패했습니다: ${e.message}`;
      console.error(e);
    } finally {
      isLoading.value = false;
      loadingStore.stopLoading();
    }
  }

  const productInfo = computed(() => product.value);
  const tabData = computed(() => {
    if (!product.value) return {};

    const baseTabData = {
      info: product.value.info,
      price: product.value.price,
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
      price: product.value?.price || [],
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

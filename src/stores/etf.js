import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import Decimal from 'decimal.js';
import { useLoadingStore } from './loading';
import { formatNumberWithComma } from '@/utils/numberUtils';

// ETF 상품 관련 상태 및 로직을 관리하는 Pinia 스토어
// 실제 API 연동 전까지 mock 데이터로 동작
export const useEtfStore = defineStore('etf', () => {
  // State
  const product = ref(null);
  const isLoading = ref(false);
  const error = ref(null);
  const loadingStore = useLoadingStore();

  // 여러 목업 상품 데이터
  const mockProducts = {
    'etf-001': {
      yield: 2.5, // 수익률 (3개월 고정)
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
      price: new Decimal(15000), // 구매/판매용 가격
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
      yield: -1.8, // 수익률 (3개월 고정)
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
      price: new Decimal(12500), // 구매/판매용 가격
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

  // 보유 내역 더미 데이터 (실제 API 응답 구조)
  const mockHoldingData = {
    'etf-001': {
      holdingsId: 3,
      productCategory: 'etf',
      holdingsTotalPrice: 1500000.0,
      holdingsTotalQuantity: 100,
      holdingsStatus: 'holding',
      history: [
        {
          historyId: 1001,
          holdingsId: 3,
          historyTradeType: 'buy',
          historyTradeDate: '2025-01-15T10:30:00',
          historyQuantity: 50,
          historyAmount: 750000
        },
        {
          historyId: 1002,
          holdingsId: 3,
          historyTradeType: 'buy',
          historyTradeDate: '2025-01-20T14:20:00',
          historyQuantity: 30,
          historyAmount: 450000
        },
        {
          historyId: 1003,
          holdingsId: 3,
          historyTradeType: 'buy',
          historyTradeDate: '2025-01-25T09:15:00',
          historyQuantity: 20,
          historyAmount: 300000
        }
      ],
      watched: true
    },
    'etf-002': {
      holdingsId: 5,
      productCategory: 'etf',
      holdingsTotalPrice: 1000000.0,
      holdingsTotalQuantity: 10,
      holdingsStatus: 'holding',
      history: [
        {
          historyId: 1007,
          holdingsId: 5,
          historyTradeType: 'sell',
          historyTradeDate: '2025-08-03T13:52:26',
          historyQuantity: 1,
          historyAmount: 100000
        },
        {
          historyId: 1006,
          holdingsId: 5,
          historyTradeType: 'buy',
          historyTradeDate: '2025-07-30T13:52:26',
          historyQuantity: 2,
          historyAmount: 200000
        },
        {
          historyId: 1005,
          holdingsId: 5,
          historyTradeType: 'buy',
          historyTradeDate: '2025-07-25T13:52:26',
          historyQuantity: 3,
          historyAmount: 300000
        }
      ],
      watched: true
    }
  };

  // API 호출 함수들
  const fetchProductDetail = async (productId, category, token) => {
    // 상품 상세 정보 API (주석처리)
    // const response = await fetch(`/api/products/${category}/${productId}`, {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     'Content-Type': 'application/json'
    //   }
    // });

    // if (!response.ok) {
    //   throw new Error('상품 상세 정보를 불러오는데 실패했습니다.');
    // }

    // return await response.json();

    // Mock 데이터 반환
    return {
      id: productId,
      name: 'TIGER 미국S&P500선물 ETN',
      category: 'etf',
      description: '미국 S&P 500 지수를 추종하는 ETN 상품입니다.',
      riskLevel: 3,
      expectedReturn: 8.5,
      managementFee: 0.35,
      minInvestment: 10000,
      composition: [
        { name: 'Apple Inc.', weight: 7.2 },
        { name: 'Microsoft Corp.', weight: 6.8 },
        { name: 'Amazon.com Inc.', weight: 3.5 },
        { name: 'Alphabet Inc.', weight: 2.9 },
        { name: 'Tesla Inc.', weight: 2.1 }
      ],
      pdfUrl: 'https://example.com/etf-prospectus.pdf'
    };
  };

  const fetchProductHolding = async (productId, token) => {
    try {
      // 상품 보유 내역 API (실제 호출)
      const response = await fetch(`http://localhost:8080/holdings/detail/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('보유 내역을 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      console.log('holdings API Response:', data);
      return data;
    } catch (error) {
      console.error('Holdings API Error:', error);

      // API 호출 실패 시 Mock 데이터 반환 (보유하지 않은 경우 null 반환)
      if (productId === 'etf-001') {
        return {
          holdingsId: 3,
          productCategory: 'etf',
          holdingsTotalPrice: 1500000.0,
          holdingsTotalQuantity: 99,
          holdingsStatus: 'holding',
          history: [
            {
              historyId: 1001,
              holdingsId: 3,
              historyTradeType: 'buy',
              historyTradeDate: '2025-01-15T10:30:00',
              historyQuantity: 49,
              historyAmount: 750000
            },
            {
              historyId: 1002,
              holdingsId: 3,
              historyTradeType: 'buy',
              historyTradeDate: '2025-01-20T14:20:00',
              historyQuantity: 30,
              historyAmount: 450000
            },
            {
              historyId: 1003,
              holdingsId: 3,
              historyTradeType: 'buy',
              historyTradeDate: '2025-01-25T09:15:00',
              historyQuantity: 20,
              historyAmount: 300000
            }
          ],
          watched: true
        };
      } else if (productId === 'etf-002') {
        return {
          holdingsId: 5,
          productCategory: 'etf',
          holdingsTotalPrice: 1000000.0,
          holdingsTotalQuantity: 10,
          holdingsStatus: 'holding',
          history: [
            {
              historyId: 1007,
              holdingsId: 5,
              historyTradeType: 'sell',
              historyTradeDate: '2025-08-03T13:52:26',
              historyQuantity: 1,
              historyAmount: 100000
            },
            {
              historyId: 1006,
              holdingsId: 5,
              historyTradeType: 'buy',
              historyTradeDate: '2025-07-30T13:52:26',
              historyQuantity: 2,
              historyAmount: 200000
            },
            {
              historyId: 1005,
              holdingsId: 5,
              historyTradeType: 'buy',
              historyTradeDate: '2025-07-25T13:52:26',
              historyQuantity: 3,
              historyAmount: 300000
            }
          ],
          watched: true
        };
      } else {
        // 보유하지 않은 상품의 경우 null 반환
        return null;
      }
    }
  };

  const fetchProductPrice = async (productId, category, token) => {
    // 상품 시세 API (주석처리)
    // const response = await fetch(`prices/${category}/${productId}`, {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     'Content-Type': 'application/json'
    //   }
    // });

    // if (!response.ok) {
    //   throw new Error('시세 정보를 불러오는데 실패했습니다.');
    // }

    // return await response.json();

    // Mock 데이터 반환
    return {
      currentPrice: 12500,
      previousPrice: 12300,
      priceChange: 200,
      priceChangePercent: 1.63,
      yield: 2.5, // 3개월 수익률 2.5%
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
      ]
    };
  };

  const fetchProductNews = async (productId, category, token) => {
    // 상품 관련 뉴스 API (주석처리)
    // const response = await fetch(`/news/${category}/${productId}`, {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     'Content-Type': 'application/json'
    //   }
    // });

    // if (!response.ok) {
    //   throw new Error('뉴스 정보를 불러오는데 실패했습니다.');
    // }

    // return await response.json();

    // Mock 데이터 반환
    return [
      {
        id: 1,
        title: 'S&P 500 지수 상승세 지속, 기술주 중심으로 강세',
        summary: '미국 주식시장이 기술주 중심으로 상승세를 보이고 있습니다.',
        publishedAt: '2024-06-14T10:00:00Z',
        source: 'Bloomberg'
      },
      {
        id: 2,
        title: '연준 금리 정책에 대한 시장 기대감 변화',
        summary: '연방준비제도가 금리 인하 가능성을 시사하며 시장이 반등했습니다.',
        publishedAt: '2024-06-13T15:30:00Z',
        source: 'Reuters'
      },
      {
        id: 3,
        title: '기업 실적 발표 시즌, 예상치 상회하는 결과들',
        summary: '주요 기업들의 실적이 시장 예상치를 상회하며 긍정적인 분위기를 조성했습니다.',
        publishedAt: '2024-06-12T09:15:00Z',
        source: 'CNBC'
      },
      {
        id: 4,
        title: 'TIGER ETF, 글로벌 투자자들의 관심 집중',
        summary: 'TIGER ETF가 글로벌 투자자들로부터 높은 관심을 받고 있습니다.',
        publishedAt: '2024-06-11T14:20:00Z',
        source: 'Yahoo Finance'
      },
      {
        id: 5,
        title: 'ETF 시장 성장세 지속, 개인투자자 참여 확대',
        summary: 'ETF 시장이 지속적인 성장세를 보이며 개인투자자들의 참여가 확대되고 있습니다.',
        publishedAt: '2024-06-10T11:45:00Z',
        source: 'MarketWatch'
      }
    ];
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
      // 4개의 API를 병렬로 호출 (모두 mock 데이터 사용)
      const [productDetail, productHolding, productPrice, productNews] = await Promise.all([
        fetchProductDetail(productId, category, authToken),
        fetchProductHolding(productId, authToken),
        fetchProductPrice(productId, category, authToken),
        fetchProductNews(productId, category, authToken)
      ]);

      // 모든 데이터를 조합하여 가공
      const combinedData = {
        // 상품 상세 정보 (Mock 데이터)
        ...productDetail,

        // 보유 내역 정보 (Mock 데이터)
        holdingData: productHolding,

        // 시세 정보 (Mock 데이터)
        priceData: productPrice,

        // 뉴스 정보 (Mock 데이터)
        newsData: productNews
      };

      // 데이터 가공 (productId 전달)
      product.value = processEtfData(combinedData, productId);
    } catch (e) {
      error.value = `ETF 상품 정보를 불러오는 데 실패했습니다: ${e.message}`;
      console.error(e);
    } finally {
      isLoading.value = false;
      loadingStore.stopLoading();
    }
  }

  // ETF 데이터 가공 함수 수정 (4개 API 데이터 조합)
  const processEtfData = (combinedData, originalProductId) => {
    const { holdingData, priceData, newsData, ...productDetail } = combinedData;

    console.log('processEtfData - combinedData:', combinedData);
    console.log('processEtfData - holdingData:', holdingData);
    console.log('processEtfData - isWatched:', holdingData?.watched);

    // 실제 전달된 productId 사용
    const productId = originalProductId;
    const mockProduct = mockProducts[productId];

    const result = {
      // 기본 상품 정보
      ...productDetail,

      // 기존 mock 데이터 활용
      ...mockProduct,

      // UI용 데이터 가공 (기존 mock 데이터 우선 사용)
      info: mockProduct?.info || generateInfoTab(productDetail),
      composition: mockProduct?.composition || generateCompositionTab(productDetail),
      pdf: mockProduct?.pdf || generatePdfTab(productDetail),
      yield: mockProduct?.yield || generateYieldTab(priceData),
      news: mockProduct?.news || generateNewsTab(newsData),

      // 보유 내역 데이터 가공
      holding: generateHoldingTab(holdingData, priceData),

      // 시세 데이터 가공
      price: generatePriceData(priceData),

      // 보유 여부 판단
      isHolding: !!holdingData,
      holdingQuantity: holdingData?.holdingsTotalQuantity || 0,

      // 찜 여부 판단
      isWatched: holdingData?.watched || false,

      // DetailMainEtf 컴포넌트용 데이터
      yield: priceData?.yield || mockProduct?.yield || 0,
      currentPrice: priceData?.currentPrice
        ? priceData.currentPrice.toLocaleString()
        : mockProduct?.currentPrice || '0',
      productCompanyName:
        mockProduct?.productCompanyName || productDetail.name?.split(' ')[0] || 'TIGER',
      productName: mockProduct?.productName || productDetail.name || 'TIGER 미국S&P500선물 ETN',
      productCode: mockProduct?.productCode || productId, // 실제 productId 사용
      productRiskGrade: mockProduct?.productRiskGrade || productDetail.riskLevel || 3,
      etfNetAssets: mockProduct?.etfNetAssets || '25.23'
    };

    console.log('🔍 Final processed ETF data:', result);
    return result;
  };

  // 시세 데이터 가공 함수
  const generatePriceData = priceData => {
    if (!priceData) return new Decimal(0);

    return {
      currentPrice: priceData.currentPrice || 0,
      previousPrice: priceData.previousPrice || 0,
      priceChange: priceData.priceChange || 0,
      priceChangePercent: priceData.priceChangePercent || 0,
      mainYield: priceData.mainYield || { value: 0, months: 0 },
      priceArr: [
        new Decimal(priceData.currentPrice || 0),
        new Decimal(priceData.previousPrice || 0)
      ]
    };
  };

  // 뉴스 데이터 가공 함수
  const generateNewsTab = newsData => {
    if (!newsData || !newsData.length) return [];

    return [
      {
        type: 'news',
        title: 'ETF 관련 뉴스',
        keyword: 'ETF',
        color: '#007AFF',
        desc: newsData.map(news => ({
          title: news.title,
          content_url: `https://example.com/news/${news.id}`,
          published_at: new Date(news.publishedAt).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }),
          labels: [news.source, 'ETF', '투자']
        }))
      }
    ];
  };

  // 수익률 데이터 가공 함수 (그래프용)
  const generateYieldTab = priceData => {
    if (!priceData) return [];

    return [
      {
        type: 'areachart',
        title: '수익률/기준가 추이',
        desc: priceData.priceHistory?.map(item => ({
          date: item.date,
          수익률: (
            ((item.price - priceData.priceHistory[0].price) / priceData.priceHistory[0].price) *
            100
          ).toFixed(1),
          기준가: item.price
        })) || [
          { date: '2024-01-01', 수익률: 0, 기준가: 12000 },
          { date: '2024-01-02', 수익률: 0.8, 기준가: 12100 },
          { date: '2024-01-03', 수익률: 1.7, 기준가: 12200 },
          { date: '2024-01-04', 수익률: 2.5, 기준가: 12300 },
          { date: '2024-01-05', 수익률: 4.2, 기준가: 12500 }
        ]
      },
      { type: 'text', title: '상장일', desc: '2010-10-14' },
      { type: 'text', title: '총보수', desc: '0.09%' },
      { type: 'text', title: '기초지수', desc: 'S&P500' }
    ];
  };

  // 정보 탭 생성 함수
  const generateInfoTab = productDetail => {
    return [
      { type: 'text', title: '상품명', desc: productDetail.name || 'TIGER 미국S&P500선물 ETN' },
      { type: 'text', title: '카테고리', desc: productDetail.category || 'ETF' },
      {
        type: 'longtext',
        title: '상품 설명',
        desc: productDetail.description || '미국 S&P 500 지수를 추종하는 ETN 상품입니다.'
      },
      { type: 'text', title: '위험 등급', desc: `${productDetail.riskLevel || 3}등급` },
      { type: 'text', title: '예상 수익률', desc: `${productDetail.expectedReturn || 8.5}%` },
      { type: 'text', title: '운용보수', desc: `${productDetail.managementFee || 0.35}%` },
      {
        type: 'text',
        title: '최소 투자금액',
        desc: `${(productDetail.minInvestment || 10000).toLocaleString()}원`
      }
    ];
  };

  // 구성 탭 생성 함수
  const generateCompositionTab = productDetail => {
    if (!productDetail.composition || !productDetail.composition.length) {
      return [];
    }

    return [
      {
        type: 'piechart',
        title: '구성종목',
        desc: productDetail.composition.map(item => ({
          종목명: item.name,
          비중: `${item.weight}%`
        }))
      },
      {
        type: 'table',
        title: '보유비중',
        desc: productDetail.composition.map(item => ({
          종목명: item.name,
          비중: `${item.weight}%`
        }))
      }
    ];
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
                url: 'https://www.samsungfund.com/report/asset-3m.pdf'
              }
            ]
          },
          {
            category: '공시문서',
            items: [
              { label: '집합투자규약', url: 'https://www.samsungfund.com/docs/rule.pdf' },
              {
                label: '투자설명서',
                url: productDetail.pdfUrl || 'https://www.samsungfund.com/docs/desc.pdf'
              },
              { label: '간이투자설명서', url: 'https://www.samsungfund.com/docs/simple.pdf' }
            ]
          }
        ]
      }
    ];
  };

  // 보유 내역 탭 생성 함수 수정
  const generateHoldingTab = (holdingData, priceData) => {
    console.log('generateHoldingTab - holdingData:', holdingData);

    if (!holdingData) {
      console.log('No holding data available');
      return [];
    }

    // 현재 시세로 평가액 계산 (Decimal 사용)
    const currentPrice = new Decimal(priceData?.currentPrice || 12500);
    const holdingsTotalQuantity = new Decimal(holdingData.holdingsTotalQuantity || 0);
    const holdingsTotalPrice = new Decimal(holdingData.holdingsTotalPrice || 0);

    const currentTotalValue = holdingsTotalQuantity.mul(currentPrice);
    const avgPrice = holdingsTotalPrice.div(holdingsTotalQuantity);
    const profitLoss = currentTotalValue.sub(holdingsTotalPrice);
    const profitLossPercent = profitLoss.div(holdingsTotalPrice).mul(100);

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
    if (holdingsTotalQuantity.gt(0) && holdingData.holdingsStatus !== 'zero') {
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

    console.log('🔍 Generated holding tab data:', result);
    return result;
  };

  // tabData computed 수정
  const tabData = computed(() => {
    if (!product.value) return {};

    const baseTabData = {
      info: product.value.info,
      yield: product.value.yield,
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
  // 보유 내역 데이터 getter (기존 유지)
  const holdingData = computed(() => {
    if (!product.value) return null;
    return mockHoldingData[product.value.productCode] || null;
  });

  // 찜 여부 getter 추가
  const isWatched = computed(() => {
    const watched = product.value?.isWatched || false;
    console.log('isWatched computed - value:', watched);
    return watched;
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
      const currentPrice = product.value?.price?.currentPrice || 12500;
      const currentTotalValue = holdingInfo.holdingsTotalQuantity * currentPrice;
      const avgPrice = holdingInfo.holdingsTotalPrice / holdingInfo.holdingsTotalQuantity;
      const profitLoss = currentTotalValue - holdingInfo.holdingsTotalPrice;
      const profitLossPercent = (profitLoss / holdingInfo.holdingsTotalPrice) * 100;

      baseTabData.holding = [
        {
          type: 'holdingsummary',
          title: '보유 현황',
          desc: {
            holdingsTotalPrice: holdingInfo.holdingsTotalPrice,
            holdingsTotalQuantity: holdingInfo.holdingsTotalQuantity,
            currentPricePerUnit: currentPrice,
            currentTotalValue: currentTotalValue,
            avgPrice: avgPrice,
            profitLoss: profitLoss,
            profitLossPercent: profitLossPercent.toFixed(2)
          }
        }
      ];

      // holdingsTotalQuantity가 0보다 크고 holdingsStatus가 'zero'가 아닐 때만 투자 기록 추가
      if (holdingInfo.holdingsTotalQuantity > 0 && holdingInfo.holdingsStatus !== 'zero') {
        baseTabData.holding.push({
          type: 'holdinghistory',
          title: '투자 기록',
          desc:
            holdingInfo.history?.map(item => ({
              ...item,
              tradeDate: new Date(item.historyTradeDate).toLocaleDateString('ko-KR')
            })) || []
        });
      }
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
    isWatched,
    getTabDataWithHolding
  };
});

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

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
      bank: 'TIGER',
      title: 'TIGER 미국S&P500',
      net_assets: '25.23', // 순자산 총액 (억 단위 문자열)
      risk: 4, // 위험 등급 (1~6)
      info: [
        { title: '펀드 특징', desc: 'S&P500 지수를 추종하는 대표적인 ETF 상품' },
        { title: '운용 전략', desc: '이 펀드는 S&P500 지수의 수익률을 최대한 근접이 펀드는 S&P500 지수의 수익률을 최대한 근접하게 추종하는 것을 목표로 하며, 분산 투자와 저비용 운용을 통해 안정적인 성과를 추구합니다.이 펀드는 S&P500 지수의 수익률을 최대한 근접하게 추종하는 것을 목표로 하며, 분산 투자와 저비용 운용을 통해 안정적인 성과를 추구합니다.이 펀드는 S&P500 지수의 수익률을 최대한 근접하게 추종하는 것을 목표로 하며, 분산 투자와 저비용 운용을 통해 안정적인 성과를 추구합니다.이 펀드는 S&P500 지수의 수익률을 최대한 근접하게 추종하는 것을 목표로 하며, 분산 투자와 저비용 운용을 통해 안정적인 성과를 추구합니다.이 펀드는 S&P500 지수의 수익률을 최대한 근접하게 추종하는 것을 목표로 하며, 분산 투자와 저비용 운용을 통해 안정적인 성과를 추구합니다.이 펀드는 S&P500 지수의 수익률을 최대한 근접하게 추종하는 것을 목표로 하며, 분산 투자와 저비용 운용을 통해 안정적인 성과를 추구합니다.하게 추종하는 것을 목표로 하며, 분산 투자와 저비용 운용을 통해 안정적인 성과를 추구합니다.\n이 펀드는 S&P500 지수의 수익률을 최대한 근접하게 추종하는 것을 목표로 하며, 분산 투자와 저비용 운용을 통해 안정적인 성과를 추구합니다.' },
        { title: '운용사', desc: '미래에셋자산운용' },
        { title: '상장일', desc: '2010-10-14' },
        { title: '총보수', desc: '0.09%' },
        { title: '기초지수', desc: 'S&P500' },
        { title: '공시/보고서', desc: [
          {
            category: '성과보고서',
            items: [
              { label: '자산운용보고서(3개월)', url: 'https://www.samsungfund.com/report/asset-3m.pdf' }
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
        ] }
      ],
      yield: [
        { title: '1개월', desc: '+2.1%' },
        { title: '3개월', desc: '+5.3%' },
        { title: '1년', desc: '+12.0%' },
        { title: '3년', desc: '+38.5%' }
      ],
      composition: [
        {
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
        { title: 'ETF 시장 동향', desc: '미국 S&P500 ETF, 최근 1년간 12% 상승' },
        { title: '운용사 소식', desc: '미래에셋, ETF 운용자산 10조 돌파' }
      ]
    },
    'etf-002': {
      bank: 'KODEX',
      title: 'KODEX 200',
      net_assets: '50.00',
      risk: 3,
      info: [
        { title: '펀드 특징', desc: '코스피 200 지수를 추종하는 ETF' }
      ],
      yield: [
        { title: '1개월', desc: '+1.5%' }
      ],
      composition: [
        {
          title: '구성종목',
          desc: [
            { 종목명: '삼성전자', 비중: '20%' },
            { 종목명: 'SK하이닉스', 비중: '10%' }
          ]
        }
      ],
      news: [
        { title: '시장 소식', desc: 'KODEX 200, 안정적인 수익률 기록' }
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
    return {
      info: product.value.info,
      yield: product.value.yield,
      composition: product.value.composition,
      news: product.value.news,
    };
  });

  return {
    product,
    isLoading,
    error,
    fetchProduct,
    productInfo,
    tabData
  };
}); 
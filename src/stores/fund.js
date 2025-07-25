import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useFundStore = defineStore('fund', () => {
  const product = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  const mockProducts = {
    'fund-001': {
      bank: '미래에셋',
      title: '미래에셋자산배분TINA펀드',
      yield: '25.97%',
      priceArr: [1414.27, 1373.72], // [오늘 기준가, 전일 기준가]
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
      news: [{ type: 'text', title: '펀드 소식', desc: '미래에셋자산배분TINA펀드, 수익률 상승' }]
    },
    'fund-002': {
      bank: '삼성',
      title: '삼성 한국형TDF 2045',
      yield: '-3.21%',
      priceArr: [987.65, 1000.0], // [오늘 기준가, 전일 기준가]
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
      news: [{ type: 'text', title: 'TDF 소식', desc: '삼성 한국형TDF, 안정적인 운용 성과' }]
    }
  };

  async function fetchProduct(productId) {
    isLoading.value = true;
    error.value = null;
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
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
    }
  }

  const productInfo = computed(() => product.value);
  const tabData = computed(() => {
    if (!product.value) return {};
    return {
      info: product.value.info,
      price: product.value.price,
      composition: product.value.composition,
      news: product.value.news
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

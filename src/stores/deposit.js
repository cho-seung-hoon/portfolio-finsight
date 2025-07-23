import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// API 모듈 임포트 (추후 생성 예정)
// import { fetchDepositProduct } from '@/api/deposit';

export const useDepositStore = defineStore('deposit', () => {
  // State
  const product = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  // Mock Data (API 연동 전 임시 데이터)
  const mockProduct = {
    bank: 'SH 수협은행',
    title: 'SH 첫만남우대예금',
    maxRate: '연 6.00%',
    maxRateDesc: '(12개월 세전)',
    baseRate: '연 3.69%',
    info: [
      { title: '상품특징', desc: '자동 만기관리부터 분할인출까지 가능한 편리한 Digital KB 대표 온라인 전용 정기예금' },
      { title: '가입 대상', desc: '실명의 개인(1인 1계좌)' },
      { title: '가입 금액', desc: '100만원이상 1,000만원이하' },
      { title: '기본 금리', desc: '연 3.69%' },
      { title: '가입 제한 여부', desc: '서민전용' },
      { title: '가입금액(한도)', desc: '2천만 원' },
      { title: '가입 방법', desc: '인터넷뱅킹, 모바일뱅킹' },
    ],
    rate: [
      { title: '저축기간', desc: '자동 만기관리부터 분할인출까지 가능한 편리한 Digital KB 대표 온라인 전용 정기예금' },
      { title: '최고금리', desc: '연 6.00% (12개월 세전)' },
      { title: '기본금리', desc: '연 3.69%' },
      { title: '최고 우대 금리', desc: '자동 만기관리부터 분할인출까지 가능한 편리한 Digital KB 대표 온라인 전용 정기예금' },
      { title: '우대금리 조건', desc: '최고 연 0.30%p (기본금리 + 우대금리)\n신규가입일 당시 영업점 및 인터넷 홈페이지 등에 고시한 조건별 우대이율 적용(중복적용불가)\n적용조건 : 1의 조건을 충족여부에 따라 최고 연 0.10%p 적용\n2의 조건을 충족여부에 따라 최고 연 0.30%p 적용\n가입기간 12개월 이상이면서 계약금액 10억 이상 : 창구 약정이율 + 0.10%p\n제공조건을 충족하는 만기해지 계좌에 가입일로부터 만기일 전날까지 적용\n⑴ 가입대상 : 만19세이상 실명의 개인 (1인 1계좌)\n⑵ 가입기간 : 12개월\n⑶ 가입금액 : 최대 2,000만원 한도 가족중 가입 당시 만 12세 이하 고객 수에 따라 다르게 적용\n⑷ 가족*중 가입 당시 만 12세 이하 고객 수에 따라 다르게 적용(2명: 연0.1%p, 3명: 연0.2%p, 4명이상: 연0.3%p) 만기해지 시점에 등록되어 있는 가족 기준' },
      { title: '유형', desc: '고정 금리' },
    ],
    notice: [
      { title: '이자지급', desc: '만기일시지급식 : 만기(후) 또는 중도해지 요청시 이자를 지급월이자지급식 : 만기이자를 매월 지급하며 중도해지 요청 시 중도해지금리로 계산하여 지급하고 매월 지급한 이자는 환입※ 만기전 해지할 경우 약정 금리보다 낮은 중도해지금리가 적용됩니다.' },
      { title: '유의사항', desc: '상품 가입 전 반드시 상품설명서 및 약관을 확인하시기 바랍니다.' },
      { title: '예금자 보호법', desc: '이 예금은 예금자보호법에 따라 원금과 소정의 이자를 합하여 1인당 "5천만원까지"(SH수협은행의 여타 보호 상품과 합산) 보호됩니다.' },
    ]
  };

  // Actions
  async function fetchProduct(productId) {
    isLoading.value = true;
    error.value = null;
    try {
      // const response = await fetchDepositProduct(productId); // 실제 API 호출
      // product.value = response.data;
      
      // Mock API 호출 (2초 딜레이)
      await new Promise(resolve => setTimeout(resolve, 200));
      product.value = mockProduct;

    } catch (e) {
      error.value = '상품 정보를 불러오는 데 실패했습니다.';
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
      rate: product.value.rate,
      notice: product.value.notice,
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
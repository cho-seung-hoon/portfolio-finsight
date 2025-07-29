import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import Decimal from 'decimal.js';
import { useLoadingStore } from './loading';

// API 모듈 임포트 (추후 생성 예정)
// import { fetchDepositProduct } from '@/api/deposit';

export const useDepositStore = defineStore('deposit', () => {
  // State
  const product = ref(null);
  const isLoading = ref(false);
  const error = ref(null);
  const loadingStore = useLoadingStore();

  // 여러 목업 상품 데이터
  const mockProducts = {
    'deposit-001': {
      productCode: 'deposit-001',
      productName: 'SH 첫만남우대예금',
      productCompanyName: 'SH 수협은행',
      productRiskGrade: 1,
      depositJoinMember: '실명의 개인(1인 1계좌)',
      depositSpclCnd: '우대 조건: 신규가입 시 최고 연 0.30%p 추가',
      depositMtrtInt: '연 3.69%',
      depositMaxLimit: new Decimal(10000000), // 최대 예금 가능 금액: 1천만원
      depositJoinWay: '인터넷뱅킹, 모바일뱅킹',
      depositJoinDeny: '서민전용',
      depositEtcNote: '상품 가입 전 반드시 상품설명서 및 약관을 확인하시기 바랍니다.',
      depositOption: '자동 만기관리, 분할인출 가능',
      isHolding: false,
      info: [
        {
          type: 'longtext',
          title: '상품특징',
          desc: '자동 만기관리부터 분할인출까지 가능한 편리한 Digital KB 대표 온라인 전용 정기예금'
        },
        { type: 'text', title: '가입 대상', desc: '실명의 개인(1인 1계좌)' },
        { type: 'text', title: '가입 금액', desc: '100만원이상 1,000만원이하' },
        { type: 'text', title: '기본 금리', desc: '연 3.69%' },
        { type: 'text', title: '가입 제한 여부', desc: '서민전용' },
        { type: 'text', title: '가입금액(한도)', desc: '2천만 원' },
        { type: 'text', title: '가입 방법', desc: '인터넷뱅킹, 모바일뱅킹' }
      ],
      rate: [
        {
          type: 'text',
          title: '저축기간',
          desc: '자동 만기관리부터 분할인출까지 가능한 편리한 Digital KB 대표 온라인 전용 정기예금'
        },
        { type: 'text', title: '최고금리', desc: '연 6.00% (12개월 세전)' },
        { type: 'text', title: '기본금리', desc: '연 3.69%' },
        {
          type: 'longtext',
          title: '최고 우대 금리',
          desc: '자동 만기관리부터 분할인출까지 가능한 편리한 Digital KB 대표 온라인 전용 정기예금'
        },
        {
          type: 'longtext',
          title: '우대금리 조건',
          desc: '최고 연 0.30%p (기본금리 + 우대금리)\n신규가입일 당시 영업점 및 인터넷 홈페이지 등에 고시한 조건별 우대이율 적용(중복적용불가)\n적용조건 : 1의 조건을 충족여부에 따라 최고 연 0.10%p 적용\n2의 조건을 충족여부에 따라 최고 연 0.30%p 적용\n가입기간 12개월 이상이면서 계약금액 10억 이상 : 창구 약정이율 + 0.10%p\n제공조건을 충족하는 만기해지 계좌에 가입일로부터 만기일 전날까지 적용\n⑴ 가입대상 : 만19세이상 실명의 개인 (1인 1계좌)\n⑵ 가입기간 : 12개월\n⑶ 가입금액 : 최대 2,000만원 한도 가족중 가입 당시 만 12세 이하 고객 수에 따라 다르게 적용\n⑷ 가족*중 가입 당시 만 12세 이하 고객 수에 따라 다르게 적용(2명: 연0.1%p, 3명: 연0.2%p, 4명이상: 연0.3%p) 만기해지 시점에 등록되어 있는 가족 기준'
        },
        { type: 'text', title: '유형', desc: '고정 금리' }
      ],
      notice: [
        {
          type: 'longtext',
          title: '이자지급',
          desc: '만기일시지급식 : 만기(후) 또는 중도해지 요청시 이자를 지급월이자지급식 : 만기이자를 매월 지급하며 중도해지 요청 시 중도해지금리로 계산하여 지급하고 매월 지급한 이자는 환입※ 만기전 해지할 경우 약정 금리보다 낮은 중도해지금리가 적용됩니다.'
        },
        {
          type: 'longtext',
          title: '유의사항',
          desc: '상품 가입 전 반드시 상품설명서 및 약관을 확인하시기 바랍니다.'
        },
        {
          type: 'longtext',
          title: '예금자 보호법',
          desc: '이 예금은 예금자보호법에 따라 원금과 소정의 이자를 합하여 1인당 "5천만원까지"(SH수협은행의 여타 보호 상품과 합산) 보호됩니다.'
        }
      ],
      news: [
        {
          type: 'news',
          title: '예금 관련 뉴스',
          keyword: '예금',
          color: '#FF9500',
          desc: [
            {
              title: 'SH 수협은행, 우대예금 금리 인상',
              content_url: 'https://example.com/news13',
              published_at: '2025.01.15',
              labels: ['예금', '수협은행', '금리']
            },
            {
              title: '디지털 뱅킹, 온라인 예금 가입 증가',
              content_url: 'https://example.com/news14',
              published_at: '2025.01.14',
              labels: ['예금', '디지털뱅킹', '온라인']
            },
            {
              title: '첫만남우대예금, 신규 고객 선호도 상승',
              content_url: 'https://example.com/news15',
              published_at: '2025.01.13',
              labels: ['예금', '우대', '신규고객']
            }
          ]
        }
      ]
    },
    'deposit-002': {
      productCode: 'deposit-002',
      productName: 'KB Star 정기예금',
      productCompanyName: 'KB 국민은행',
      productRiskGrade: 1,
      depositJoinMember: '실명의 개인',
      depositSpclCnd: '우대 조건 없음',
      depositMtrtInt: '연 3.00%',
      depositMaxLimit: new Decimal(5000000), // 최대 예금 가능 금액: 500만원
      depositJoinWay: '인터넷뱅킹, 모바일뱅킹',
      depositJoinDeny: '제한 없음',
      depositEtcNote: '상품설명서를 꼭 확인하세요.',
      depositOption: '기본 정기예금',
      isHolding: true,
      info: [
        { type: 'text', title: '상품특징', desc: 'KB 국민은행의 대표 정기예금 상품입니다.' },
        { type: 'text', title: '가입 대상', desc: '실명의 개인' }
      ],
      rate: [
        { type: 'text', title: '저축기간', desc: '6개월' },
        { type: 'text', title: '최고금리', desc: '연 5.50% (6개월 세전)' }
      ],
      notice: [{ type: 'text', title: '유의사항', desc: '상품설명서를 꼭 확인하세요.' }],
      news: [
        {
          type: 'news',
          title: 'KB 은행 관련 뉴스',
          keyword: 'KB',
          color: '#FF3B30',
          desc: [
            {
              title: 'KB 국민은행, 정기예금 금리 조정',
              content_url: 'https://example.com/news16',
              published_at: '2025.01.15',
              labels: ['KB', '국민은행', '정기예금']
            },
            {
              title: 'KB Star 정기예금, 고객 만족도 상승',
              content_url: 'https://example.com/news17',
              published_at: '2025.01.14',
              labels: ['KB', 'Star', '만족도']
            },
            {
              title: 'KB 은행, 디지털 전환 가속화',
              content_url: 'https://example.com/news18',
              published_at: '2025.01.13',
              labels: ['KB', '디지털', '전환']
            }
          ]
        }
      ]
    }
  };

  // 보유 내역 더미 데이터
  const mockHoldingData = {
    'deposit-002': {
      holdingsId: 'holding-deposit-002',
      userId: 'user123',
      productCode: 'deposit-002',
      productCategory: 'deposit',
      holdingsTotalPrice: new Decimal(5000000), // 예금액 500만원
      holdingsTotalQuantity: 1, // 예금은 수량 개념이 없으므로 1
      holdingsStatus: 'holding',
      contractDate: '2025.01.15', // 예금 체결일
      maturityDate: '2025.07.15' // 예금 만료일 (6개월)
    }
  };

  // Actions
  async function fetchProduct(productId) {
    isLoading.value = true;
    // 로딩 상태 초기화
    loadingStore.resetLoading();
    loadingStore.startLoading('예금 정보를 불러오는 중...');
    error.value = null;
    try {
      // const response = await fetchDepositProduct(productId); // 실제 API 호출
      // product.value = response.data;

      // 0.5초 대기 (더미 데이터 로딩 시뮬레이션)
      await new Promise(resolve => setTimeout(resolve, 500));
      if (mockProducts[productId]) {
        product.value = mockProducts[productId];
      } else {
        throw new Error('상품을 찾을 수 없습니다.');
      }
    } catch (e) {
      error.value = `상품 정보를 불러오는 데 실패했습니다: ${e.message}`;
      console.error(e);
    } finally {
      isLoading.value = false;
      loadingStore.stopLoading();
    }
  }

  // Getters
  const productInfo = computed(() => product.value);
  const tabData = computed(() => {
    if (!product.value) return {};

    const baseTabData = {
      info: product.value.info,
      rate: product.value.rate,
      notice: product.value.notice,
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
      rate: product.value?.rate || [],
      notice: product.value?.notice || [],
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
          type: 'holdingsummarydeposit',
          title: '보유 현황',
          desc: {
            contractDate: holdingInfo.contractDate,
            maturityDate: holdingInfo.maturityDate,
            holdingsTotalPrice: holdingInfo.holdingsTotalPrice
          }
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

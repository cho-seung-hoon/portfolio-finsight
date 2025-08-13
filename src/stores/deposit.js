import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import Decimal from 'decimal.js';
import { useLoadingStore } from './loading';
import { formatNumberWithComma } from '@/utils/numberUtils';

// 예금 상품 관련 상태 및 로직을 관리하는 Pinia 스토어
export const useDepositStore = defineStore('deposit', () => {
  // State
  const product = ref(null);
  const isLoading = ref(false);
  const error = ref(null);
  const loadingStore = useLoadingStore();

  // Mock 데이터 (API 호출 실패 시 사용)
  const mockProductData = {
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
    doption: [
      {
        doptionId: 1,
        doptionSaveTrm: '12',
        doptionIntrRate: 3.69,
        doptionFinCoNo: '0010001',
        doptionDclsMonth: '202501',
        doptionIntrRateType: 'S',
        doptionIntrRateTypeNm: '단리',
        doptionIntrRate2: 3.69
      }
    ],
    // Mock 보유 내역 데이터 (보유하지 않은 경우 null)
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
      return data;
    } catch (error) {
      console.error('Product API Error:', error);
      console.log('Using mock data due to API failure');

      // API 호출 실패 시 Mock 데이터 반환
      return {
        ...mockProductData,
        productCode: productId,
        // 보유 내역은 실제 API에서만 받아오므로 Mock에서는 null
        holdings: null
      };
    }
  };

  // Actions - fetchProduct 함수 수정
  async function fetchProduct(productId, category = 'deposit', token) {
    isLoading.value = true;
    loadingStore.resetLoading();
    loadingStore.startLoading('예금 정보를 불러오는 중...');
    error.value = null;

    // 토큰이 전달되지 않았으면 localStorage에서 가져오기
    const authToken = token || localStorage.getItem('accessToken');

    console.log('Using token:', authToken ? 'Token exists' : 'No token');

    try {
      // 하나의 API로 모든 정보 가져오기
      const productDetail = await fetchProductDetail(productId, category, authToken);

      // 데이터 가공
      product.value = processDepositData(productDetail, productId);
    } catch (e) {
      error.value = `예금 상품 정보를 불러오는 데 실패했습니다: ${e.message}`;
      console.error(e);
    } finally {
      isLoading.value = false;
      loadingStore.stopLoading();
    }
  }

  // 예금 데이터 가공 함수 수정
  const processDepositData = (productDetail, originalProductId) => {
    console.log('processDepositData - productDetail:', productDetail);

    // 실제 전달된 productId 사용
    const productId = originalProductId;

    // 금리 옵션 중 12개월 우선, 없으면 가장 긴 기간 선택
    const options = Array.isArray(productDetail.doption) ? productDetail.doption : [];
    const option12 = options.find(o => String(o.doptionSaveTrm) === '12');
    const selectedOption =
      option12 || options.sort((a, b) => Number(b.doptionSaveTrm) - Number(a.doptionSaveTrm))[0];
    const baseRateStr = selectedOption ? `연 ${selectedOption.doptionIntrRate}%` : '-';
    const maxRateStr = selectedOption ? `연 ${selectedOption.doptionIntrRate2}%` : '-';

    const result = {
      // 기본 상품 정보 (API 응답)
      ...productDetail,

      // UI용 데이터 가공
      info: generateInfoTab(productDetail),
      rate: generateRateTab(productDetail),
      notice: generateNoticeTab(productDetail),

      // 보유 내역 데이터 가공 (API 응답에서)
      holding: generateHoldingTab(productDetail.holdings, productDetail),

      // 보유 여부 판단
      isHolding: !!productDetail.holdings,
      // 예금의 경우 보유가 있으면 수량 개념이 없어도 1로 간주
      holdingQuantity: (() => {
        const q = productDetail.holdings?.holdings_total_quantity;
        if (q == null || Number(q) === 0) {
          return productDetail.holdings ? 1 : 0;
        }
        return Number(q);
      })(),
      holdingsTotalQuantity: (() => {
        const q = productDetail.holdings?.holdings_total_quantity;
        if (q == null || Number(q) === 0) {
          return productDetail.holdings ? 1 : 0;
        }
        return Number(q);
      })(),

      // 찜 여부 판단
      isWatched: productDetail.holdings?.isWatched || false,

      // DetailMainDeposit 컴포넌트용 데이터
      productCompanyName: productDetail.productCompanyName || 'SH 수협은행',
      productName: productDetail.productName || 'SH 첫만남우대예금',
      productCode: productDetail.productCode || productId,
      productRiskGrade: productDetail.productRiskGrade || 1,
      // 원본 최대 한도는 숫자 또는 Decimal로 유지
      depositMaxLimit: productDetail.depositMaxLimit ?? new Decimal(10000000),
      // 금리 표시 (12개월 우선)
      baseRate: baseRateStr,
      maxRate: maxRateStr
    };

    console.log('Final processed deposit data:', result);
    return result;
  };

  // 정보 탭 생성 함수 (실제 API 응답 구조에 맞춰 수정)
  const generateInfoTab = productDetail => {
    return [
      {
        type: 'text',
        title: '상품명',
        desc: productDetail.productName || 'SH 첫만남우대예금'
      },
      { type: 'text', title: '은행명', desc: productDetail.productCompanyName || 'SH 수협은행' },
      {
        type: 'text',
        title: '가입 대상',
        desc: productDetail.depositJoinMember || '실명의 개인(1인 1계좌)'
      },
      {
        type: 'text',
        title: '특별 조건',
        desc: productDetail.depositSpclCnd || '우대 조건: 신규가입 시 최고 연 0.30%p 추가'
      },
      {
        type: 'longtext',
        title: '만기 후 이자율',
        desc: productDetail.depositMtrtInt || '연 3.69%'
      },
      {
        type: 'text',
        title: '최대 가입 한도',
        desc: (() => {
          const val = productDetail.depositMaxLimit;
          if (val instanceof Decimal) return `${(val.toNumber() / 1e4).toFixed(0)}만원`;
          if (typeof val === 'number') return `${(val / 1e4).toFixed(0)}만원`;
          return '1,000만원';
        })()
      },
      {
        type: 'text',
        title: '가입 방법',
        desc: productDetail.depositJoinWay || '인터넷뱅킹, 모바일뱅킹'
      },
      { type: 'text', title: '가입 제한', desc: productDetail.depositJoinDeny || '서민전용' },
      {
        type: 'longtext',
        title: '기타 참고사항',
        desc:
          productDetail.depositEtcNote ||
          '상품 가입 전 반드시 상품설명서 및 약관을 확인하시기 바랍니다.'
      }
    ];
  };

  // 금리 탭 생성 함수 (실제 API 응답 구조에 맞춰 수정)
  const generateRateTab = productDetail => {
    const doption = productDetail.doption;
    if (!doption || !doption.length) return [];

    // 12개월 우선, 없으면 가장 긴 기간 선택
    const option12 = doption.find(o => String(o.doptionSaveTrm) === '12');
    const selected =
      option12 ||
      [...doption].sort((a, b) => Number(b.doptionSaveTrm) - Number(a.doptionSaveTrm))[0];

    return [
      {
        type: 'text',
        title: '저축기간',
        desc: `${selected.doptionSaveTrm}개월`
      },
      {
        type: 'text',
        title: '최고금리',
        desc: `연 ${selected.doptionIntrRate2}% (${selected.doptionSaveTrm}개월 세전)`
      },
      {
        type: 'text',
        title: '기본금리',
        desc: `연 ${selected.doptionIntrRate}%`
      },
      {
        type: 'longtext',
        title: '우대금리 조건',
        desc: productDetail.depositSpclCnd || '우대 조건: 신규가입 시 최고 연 0.30%p 추가'
      },
      {
        type: 'text',
        title: '이자 계산 방식',
        desc: selected.doptionIntrRateTypeNm || '단리'
      }
    ];
  };

  // 유의사항 탭 생성 함수 (실제 API 응답 구조에 맞춰 수정)
  const generateNoticeTab = productDetail => {
    return [
      {
        type: 'longtext',
        title: '이자지급',
        desc: '만기일시지급식 : 만기(후) 또는 중도해지 요청시 이자를 지급월이자지급식 : 만기이자를 매월 지급하며 중도해지 요청 시 중도해지금리로 계산하여 지급하고 매월 지급한 이자는 환입※ 만기전 해지할 경우 약정 금리보다 낮은 중도해지금리가 적용됩니다.'
      },
      {
        type: 'longtext',
        title: '유의사항',
        desc:
          productDetail.depositEtcNote ||
          '상품 가입 전 반드시 상품설명서 및 약관을 확인하시기 바랍니다.'
      },
      {
        type: 'longtext',
        title: '예금자 보호법',
        desc: '이 예금은 예금자보호법에 따라 원금과 소정의 이자를 합하여 1인당 "5천만원까지"(은행의 여타 보호 상품과 합산) 보호됩니다.'
      }
    ];
  };

  // 보유 내역 탭 생성 함수 수정 (실제 API 응답 구조에 맞춰 수정)
  const generateHoldingTab = (holdingData, productDetail) => {
    console.log('generateHoldingTab - holdingData:', holdingData);

    if (!holdingData) {
      console.log('No holding data available');
      return [];
    }

    // 예금은 수량 개념이 없으므로 1로 고정
    const holdingsTotalQuantity = new Decimal(holdingData.holdings_total_quantity || 1);
    const holdingsTotalPrice = new Decimal(holdingData.holdings_total_price || 0);

    const result = [
      {
        type: 'holdingsummarydeposit',
        title: '보유 현황',
        desc: {
          holdingsTotalPrice: holdingsTotalPrice.toNumber(),
          holdingsTotalQuantity: holdingsTotalQuantity.toNumber(),
          contractDate: new Date(
            holdingData.history?.[0]?.historyTradeDate || new Date()
          ).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }),
          maturityDate: new Date(
            holdingData.history?.[0]?.historyTradeDate || new Date()
          ).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          })
        }
      }
    ];

    // 예금 기록이 있을 때만 투자 기록 추가
    if (holdingData.history && holdingData.history.length > 0) {
      result.push({
        type: 'holdinghistory',
        title: '투자 기록',
        desc: holdingData.history.map(item => {
          // 거래 타입에 따른 표시 형식 설정
          const isDeposit = item.historyTradeType === 'deposit';
          const isWithdrawal = item.historyTradeType === 'withdrawal';

          // 거래 수량에 부호 추가 (콤마 포함)
          const quantity = new Decimal(item.historyQuantity || 0);
          const displayQuantity = isWithdrawal
            ? `-${formatNumberWithComma(quantity.toNumber())}`
            : `+${formatNumberWithComma(quantity.toNumber())}`;

          // 거래 금액에 부호 추가 (콤마 포함)
          const amount = new Decimal(item.historyAmount || 0);
          const displayAmount = isWithdrawal
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
            isDeposit,
            isWithdrawal,
            // 색상 정보
            quantityColor: isWithdrawal ? '#FF3B30' : '#007AFF',
            amountColor: isWithdrawal ? '#FF3B30' : '#007AFF'
          };
        })
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
      rate: product.value.rate,
      notice: product.value.notice
    };

    // 보유 중인 상품이고 보유수량이 0보다 크고 holdingsStatus가 "zero"가 아닐 때만 holding 데이터 추가
    const hasValidHoldings = product.value.isHolding && 
      (product.value.holding || product.value.holdings) &&
      (product.value.holdings?.holdingsTotalQuantity > 0 || product.value.holding?.holdingsTotalQuantity > 0) &&
      product.value.holdings?.holdingsStatus !== 'zero';
    
    if (hasValidHoldings) {
      // holdingsummarydeposit 타입의 데이터 생성 (가입 직후와 동일한 구조)
      const holdingSummaryData = {
        type: 'holdingsummarydeposit',
        title: '보유 현황',
        desc: {
          contractDate: product.value.holding?.contractDate || product.value.holdings?.contractDate,
          maturityDate: product.value.holding?.maturityDate || product.value.holdings?.maturityDate,
          holdingsTotalPrice: product.value.holding?.holdingsTotalPrice || product.value.holdings?.holdingsTotalPrice || 0,
          // 가입 직후와 동일한 구조를 위해 추가 필드들
          startDate: product.value.holding?.startDate || product.value.holdings?.contractDate,
          period: product.value.holding?.period || null
        }
      };

      // holdinghistorydeposit 타입의 데이터 생성 (예금 전용)
      const holdingHistoryData = {
        type: 'holdinghistorydeposit',
        title: '투자 기록',
        desc: product.value.holding?.history || product.value.holdings?.history || []
      };

      baseTabData.holding = [holdingSummaryData, holdingHistoryData];
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
    isWatched
  };
});

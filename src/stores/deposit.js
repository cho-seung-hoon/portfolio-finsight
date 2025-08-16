import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import Decimal from 'decimal.js';
import { useLoadingStore } from './loading';
import { formatNumberWithComma } from '@/utils/numberUtils';
import { useSessionStore } from '@/stores/session.js';

export const useDepositStore = defineStore('deposit', () => {

  const sessionStore = useSessionStore();

  const product = ref(null);
  const isLoading = ref(false);
  const error = ref(null);
  const loadingStore = useLoadingStore();

  const mockProductData = {
    productCode: 'deposit-001',
    productName: 'SH 첫만남우대예금',
    productCompanyName: 'SH 수협은행',
    productRiskGrade: 1,
    depositJoinMember: '실명의 개인(1인 1계좌)',
    depositSpclCnd: '우대 조건: 신규가입 시 최고 연 0.30%p 추가',
    depositMtrtInt: '연 3.69%',
    depositMaxLimit: new Decimal(10000000),
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

      return {
        ...mockProductData,
        productCode: productId,
        holdings: null
      };
    }
  };

  async function fetchProduct(productId, category = 'deposit', token) {
    isLoading.value = true;
    loadingStore.resetLoading();
    loadingStore.startLoading('예금 정보를 불러오는 중...');
    error.value = null;

    // 토큰이 전달되지 않았으면 sessionStore에서 가져오기
    const authToken = token || sessionStore.accessToken;

    console.log('Using token:', authToken ? 'Token exists' : 'No token');

    try {
      const productDetail = await fetchProductDetail(productId, category, authToken);
      product.value = processDepositData(productDetail, productId);
    } catch (e) {
      error.value = `예금 상품 정보를 불러오는 데 실패했습니다: ${e.message}`;
      console.error(e);
    } finally {
      isLoading.value = false;
      loadingStore.stopLoading();
    }
  }

  const processDepositData = (productDetail, originalProductId) => {
    const productId = originalProductId;

    if (productDetail.holdings?.history?.[0]?.contractMonths) {
      productDetail.holdings.contractMonths = productDetail.holdings.history[0].contractMonths;
    }

    const options = Array.isArray(productDetail.doption) ? productDetail.doption : [];
    const option12 = options.find(o => String(o.doptionSaveTrm) === '12');
    const selectedOption =
      option12 || options.sort((a, b) => Number(b.doptionSaveTrm) - Number(a.doptionSaveTrm))[0];
    const baseRateStr = selectedOption ? `연 ${selectedOption.doptionIntrRate}%` : '-';
    const maxRateStr = selectedOption ? `연 ${selectedOption.doptionIntrRate2}%` : '-';

    const result = {
      ...productDetail,

      info: generateInfoTab(productDetail),
      rate: generateRateTab(productDetail),
      notice: generateNoticeTab(productDetail),

      holding: generateHoldingTab(productDetail.holdings, productDetail),

      isHolding: !!productDetail.holdings,
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

      isWatched: productDetail.holdings?.isWatched || false,

      productCompanyName: productDetail.productCompanyName || 'SH 수협은행',
      productName: productDetail.productName || 'SH 첫만남우대예금',
      productCode: productDetail.productCode || productId,
      productRiskGrade: productDetail.productRiskGrade || 1,
      depositMaxLimit: productDetail.depositMaxLimit ?? new Decimal(10000000),
      baseRate: baseRateStr,
      maxRate: maxRateStr
    };

    return result;
  };

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

  const generateRateTab = productDetail => {
    const doption = productDetail.doption;
    if (!doption || !doption.length) return [];

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

  const generateHoldingTab = (holdingData, productDetail) => {
    if (!holdingData) {
      return [];
    }

    // 여러 필드명에서 holdingsTotalPrice를 찾아보기
    let holdingsTotalPrice = new Decimal(0);
    if (holdingData.holdingsTotalPrice !== undefined && holdingData.holdingsTotalPrice !== null) {
      holdingsTotalPrice = new Decimal(holdingData.holdingsTotalPrice);
    } else if (holdingData.holdings_total_price !== undefined && holdingData.holdings_total_price !== null) {
      holdingsTotalPrice = new Decimal(holdingData.holdings_total_price);
    } else if (holdingData.holdingsTotalAmount !== undefined && holdingData.holdingsTotalAmount !== null) {
      holdingsTotalPrice = new Decimal(holdingData.holdingsTotalAmount);
    } else if (holdingData.holdings_total_amount !== undefined && holdingData.holdings_total_amount !== null) {
      holdingsTotalPrice = new Decimal(holdingData.holdings_total_amount);
    } else if (holdingData.history && holdingData.history.length > 0) {
      // history에서 총 금액 계산
      const totalAmount = holdingData.history.reduce((sum, item) => {
        if (item.historyTradeType === 'deposit') {
          return sum.plus(item.historyAmount || 0);
        } else if (item.historyTradeType === 'withdrawal') {
          return sum.minus(item.historyAmount || 0);
        }
        return sum;
      }, new Decimal(0));
      holdingsTotalPrice = totalAmount;
    }

    const holdingsTotalQuantity = new Decimal(holdingData.holdingsTotalQuantity || holdingData.holdings_total_quantity || 1);

    let contractDate = holdingData.contractDate;
    if (!contractDate && holdingData.history && holdingData.history.length > 0) {
      contractDate = holdingData.history[0].historyTradeDate;
    }

    const contractMonths = holdingData.contractMonths;

    let maturityDate = holdingData.maturityDate;
    if (contractDate && contractMonths && !maturityDate) {
      try {
        const contract = new Date(contractDate);
        if (!isNaN(contract.getTime())) {
          contract.setMonth(contract.getMonth() + contractMonths);
          maturityDate = contract.toISOString();
        } else {
          maturityDate = null;
        }
      } catch (error) {
        maturityDate = null;
      }
    }

    const result = [
      {
        type: 'holdingsummarydeposit',
        title: '보유 현황',
        desc: {
          holdingsTotalPrice: holdingsTotalPrice.toNumber(),
          holdingsTotalQuantity: holdingsTotalQuantity.toNumber(),
          contractDate: contractDate,
          maturityDate: maturityDate,
          contractMonths: contractMonths,
          history: holdingData.history
        }
      }
    ];

    if (holdingData.history && holdingData.history.length > 0) {
      result.push({
        type: 'holdinghistorydeposit',
        title: '투자 기록',
        desc: holdingData.history.map(item => {
          const isDeposit = item.historyTradeType === 'deposit';
          const isWithdrawal = item.historyTradeType === 'withdrawal';

          const quantity = new Decimal(item.historyQuantity || 0);
          const displayQuantity = isWithdrawal
            ? `-${formatNumberWithComma(quantity.toNumber())}`
            : `+${formatNumberWithComma(quantity.toNumber())}`;

          const amount = new Decimal(item.historyAmount || 0);
          const displayAmount = isWithdrawal
            ? `-${formatNumberWithComma(amount.toNumber())}`
            : `+${formatNumberWithComma(amount.toNumber())}`;

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
            historyQuantity: item.historyQuantity,
            historyAmount: item.historyAmount,
            historyTradeDate: item.historyTradeDate,
            displayQuantity,
            displayAmount,
            displayDate,
            isDeposit,
            isWithdrawal,
            isBuy: isDeposit,
            isSell: isWithdrawal,
            quantityColor: isWithdrawal ? '#FF3B30' : '#007AFF',
            amountColor: isWithdrawal ? '#FF3B30' : '#007AFF'
          };
        })
      });
    }

    return result;
  };

  const tabData = computed(() => {
    if (!product.value) return {};

    const baseTabData = {
      info: product.value.info,
      rate: product.value.rate,
      notice: product.value.notice
    };

    const hasValidHoldings = product.value.isHolding && 
      (product.value.holding || product.value.holdings) &&
      (product.value.holdings?.holdingsTotalQuantity > 0 || product.value.holding?.holdingsTotalQuantity > 0) &&
      product.value.holdings?.holdingsStatus !== 'zero';
    
    if (hasValidHoldings) {
      const holdingTabData = generateHoldingTab(
        product.value.holdings || product.value.holding, 
        product.value
      );
      
      baseTabData.holding = holdingTabData;
    }

    return baseTabData;
  });

  const productInfo = computed(() => product.value);

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

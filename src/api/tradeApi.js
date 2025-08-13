import axios from 'axios';
import Decimal from 'decimal.js';

// Decimal.js를 사용하여 decimal(15,2) 정밀도 보장
function toDecimalSafe(value) {
  try {
    if (value == null || value === '') return new Decimal(0);
    if (value instanceof Decimal) return value;
    if (typeof value === 'number') return new Decimal(value);
    if (typeof value === 'string') {
      const cleaned = value.replace(/[^0-9.-]/g, '');
      const parsed = parseFloat(cleaned);
      return Number.isFinite(parsed) ? new Decimal(parsed) : new Decimal(0);
    }
    // Decimal.js or similar
    if (typeof value === 'object' && typeof value.toNumber === 'function') {
      return new Decimal(value.toNumber());
    }
    return new Decimal(value || 0);
  } catch {
    return new Decimal(0);
  }
}

// decimal(15,2) 정밀도로 반올림하는 함수
function roundToDecimal(value, decimalPlaces = 2) {
  try {
    const decimal = toDecimalSafe(value);
    return decimal.toDecimalPlaces(decimalPlaces);
  } catch {
    return new Decimal(0);
  }
}

function normalizeTradePayload(raw) {
  const code = raw?.productCode || raw?.code || raw?.product_code || '';
  const categoryRaw = raw?.productCategory || raw?.category || raw?.product_category || '';
  const category = categoryRaw ? String(categoryRaw).toUpperCase() : '';

  // decimal(15,2) 정밀도로 처리
  const quantity = roundToDecimal(raw?.quantity);
  const amount = roundToDecimal(raw?.amount);
  const price = roundToDecimal(raw?.price);

  const buyDate = raw?.buyDate || raw?.buy_date || null;
  const saleDate = raw?.saleDate || raw?.sale_date || null;
  const startDate = raw?.startDate || raw?.start_date || null;

  // contractMonths 설정: 예금만 전송, ETF/Fund는 전송하지 않음
  let contractMonths;
  if (category === 'DEPOSIT') {
    contractMonths = raw?.contractMonths;
  }
  // ETF/Fund는 contractMonths를 전송하지 않음

  // Include both camelCase and snake_case to maximize backend compatibility
  const body = {
    // identifiers
    productCode: code,
    product_code: code,

    productCategory: category,
    product_category: category,

    // numbers - decimal(15,2) 정밀도로 전송
    quantity: quantity.toNumber(),
    amount: amount.toNumber(),
    price: price.toNumber(),

    // dates
    buyDate,
    buy_date: buyDate,
    saleDate,
    sale_date: saleDate,
    startDate,
    start_date: startDate,

    // extras
    contractMonths,
  };

  // Remove undefined keys while preserving nulls (dates may be null intentionally)
  Object.keys(body).forEach(k => {
    if (body[k] === undefined) delete body[k];
  });

  return body;
}

// API 응답에서 decimal(15,2) 데이터를 안전하게 처리하는 함수
function processDecimalResponse(responseData) {
  try {
    if (!responseData) return responseData;
    
    // 응답 데이터의 숫자 필드들을 decimal(15,2)로 처리
    const processed = { ...responseData };
    
    // history 관련 필드들 처리
    if (processed.history && Array.isArray(processed.history)) {
      processed.history = processed.history.map(item => ({
        ...item,
        historyQuantity: roundToDecimal(item.historyQuantity).toNumber(),
        historyAmount: roundToDecimal(item.historyAmount).toNumber(),
        // 기타 숫자 필드들도 필요시 추가
      }));
    }
    
    // 단일 숫자 필드들 처리
    const numericFields = ['quantity', 'amount', 'price', 'totalQuantity', 'totalAmount'];
    numericFields.forEach(field => {
      if (processed[field] !== undefined) {
        processed[field] = roundToDecimal(processed[field]).toNumber();
      }
    });
    
    return processed;
  } catch (error) {
    console.error('응답 데이터 처리 중 오류:', error);
    return responseData;
  }
}

// 매수 함수
export async function purchaseProduct(tradeData) {
  try {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      console.error('인증 토큰이 없습니다.');
      return { success: false, error: '인증 토큰이 없습니다.' };
    }

    const body = normalizeTradePayload(tradeData);
    
    // API 호출 전 payload 로그 확인
    console.log('=== Purchase API Payload ===');
    console.log('Original tradeData:', tradeData);
    console.log('Normalized payload:', body);
    console.log('Decimal precision - quantity:', body.quantity, 'amount:', body.amount, 'price:', body.price);
    console.log('contractMonths value:', body.contractMonths);
    console.log('period value:', body.period);
    console.log('===========================');

    const response = await axios.post('http://localhost:8080/holdings/purchases', body, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    // 응답 데이터를 decimal(15,2)에 맞게 처리
    const processedData = processDecimalResponse(response.data);
    
    console.log('매수 성공:', processedData);
    return { success: true, data: processedData };
  } catch (error) {
    console.error('매수 실패:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

// 매도 함수
export async function sellProduct(tradeData) {
  try {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      console.error('인증 토큰이 없습니다.');
      return { success: false, error: '인증 토큰이 없습니다.' };
    }

    const body = normalizeTradePayload(tradeData);
    
    // API 호출 전 payload 로그 확인
    console.log('=== Sell API Payload ===');
    console.log('Original tradeData:', tradeData);
    console.log('Normalized payload:', body);
    console.log('Decimal precision - quantity:', body.quantity, 'amount:', body.amount, 'price:', body.price);
    console.log('contractMonths value:', body.contractMonths);
    console.log('period value:', body.period);
    console.log('===========================');

    const response = await axios.post('http://localhost:8080/holdings/sales', body, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    // 응답 데이터를 decimal(15,2)에 맞게 처리
    const processedData = processDecimalResponse(response.data);
    
    console.log('매도 성공:', processedData);
    return { success: true, data: processedData };
  } catch (error) {
    console.error('매도 실패:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

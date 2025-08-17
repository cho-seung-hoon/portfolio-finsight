import axios from 'axios';
import Decimal from 'decimal.js';
import apiClient from './index.js';
import { useSessionStore } from '@/stores/session';

const sessionStore = useSessionStore();

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
    if (typeof value === 'object' && typeof value.toNumber === 'function') {
      return new Decimal(value.toNumber());
    }
    return new Decimal(value || 0);
  } catch {
    return new Decimal(0);
  }
}

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

  const quantity = roundToDecimal(raw?.quantity);
  const amount = roundToDecimal(raw?.amount);
  const price = roundToDecimal(raw?.price);

  const buyDate = raw?.buyDate || raw?.buy_date || null;
  const saleDate = raw?.saleDate || raw?.sale_date || null;
  const startDate = raw?.startDate || raw?.start_date || null;

  let contractMonths;
  if (category === 'DEPOSIT') {
    contractMonths = raw?.contractMonths;
  }

  const body = {
    productCode: code,
    product_code: code,

    productCategory: category,
    product_category: category,

    quantity: quantity.toNumber(),
    amount: amount.toNumber(),
    price: price.toNumber(),

    buyDate,
    buy_date: buyDate,
    saleDate,
    sale_date: saleDate,
    startDate,
    start_date: startDate,

    contractMonths
  };

  Object.keys(body).forEach(k => {
    if (body[k] === undefined) delete body[k];
  });

  return body;
}

function processDecimalResponse(responseData) {
  try {
    if (!responseData) return responseData;

    const processed = { ...responseData };

    if (processed.history && Array.isArray(processed.history)) {
      processed.history = processed.history.map(item => ({
        ...item,
        historyQuantity: roundToDecimal(item.historyQuantity).toNumber(),
        historyAmount: roundToDecimal(item.historyAmount).toNumber()
      }));
    }

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

export async function purchaseProduct(tradeData) {
  try {
    const token = sessionStore.accessToken;

    if (!token) {
      console.error('인증 토큰이 없습니다.');
      return { success: false, error: '인증 토큰이 없습니다.' };
    }

    const body = normalizeTradePayload(tradeData);

    const response = await axios.post('http://localhost:8080/holdings/purchases', body, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const processedData = processDecimalResponse(response.data);

    return { success: true, data: processedData };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
}

export async function sellProduct(tradeData) {
  try {
    const token = sessionStore.accessToken;

    if (!token) {
      console.error('인증 토큰이 없습니다.');
      return { success: false, error: '인증 토큰이 없습니다.' };
    }

    const body = normalizeTradePayload(tradeData);

    const response = await axios.post('http://localhost:8080/holdings/sales', body, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const processedData = processDecimalResponse(response.data);

    console.log('매도 성공:', processedData);
    return { success: true, data: processedData };
  } catch (error) {
    console.error('매도 실패:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

export const getMyPortfolioApi = () => {
  return apiClient.get('/holdings/mp');
};

export const getDepositHoldingsApi = () => {
  return apiClient.get('/holdings/deposit');
};

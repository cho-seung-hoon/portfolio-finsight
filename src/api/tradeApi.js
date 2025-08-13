import axios from 'axios';

function toNumberSafe(value) {
  try {
    if (value == null || value === '') return 0;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const cleaned = value.replace(/[^0-9.-]/g, '');
      const parsed = Number(cleaned);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    // Decimal.js or similar
    if (typeof value === 'object' && typeof value.toNumber === 'function') {
      return value.toNumber();
    }
    return Number(value) || 0;
  } catch {
    return 0;
  }
}

function normalizeTradePayload(raw) {
  const code = raw?.productCode || raw?.code || raw?.product_code || '';
  const categoryRaw = raw?.productCategory || raw?.category || raw?.product_category || '';
  const category = categoryRaw ? String(categoryRaw).toUpperCase() : '';

  const quantity = toNumberSafe(raw?.quantity);
  const amount = toNumberSafe(raw?.amount);
  const price = toNumberSafe(raw?.price);

  const buyDate = raw?.buyDate || raw?.buy_date || null;
  const saleDate = raw?.saleDate || raw?.sale_date || null;
  const startDate = raw?.startDate || raw?.start_date || null;
  const period = raw?.period != null ? toNumberSafe(raw?.period) : undefined;

  // Include both camelCase and snake_case to maximize backend compatibility
  const body = {
    // identifiers
    productCode: code,
    product_code: code,

    productCategory: category,
    product_category: category,

    // numbers
    quantity,
    amount,
    price,

    // dates
    buyDate,
    buy_date: buyDate,
    saleDate,
    sale_date: saleDate,
    startDate,
    start_date: startDate,

    // extras
    period,
  };

  // Remove undefined keys while preserving nulls (dates may be null intentionally)
  Object.keys(body).forEach(k => {
    if (body[k] === undefined) delete body[k];
  });

  return body;
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

    const response = await axios.post('http://localhost:8080/holdings/purchases', body, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('매수 성공:', response.data);
    return { success: true, data: response.data };
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

    const response = await axios.post('http://localhost:8080/holdings/sales', body, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('매도 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('매도 실패:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

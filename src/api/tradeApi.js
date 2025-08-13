import apiClient from './index.js';

// 투자 모아보기(보유 상품 평가액) 조회
export const getAllPrice = async () => {
  return apiClient.get('/holdings/');
};

// 매수 함수
export async function purchaseProduct(tradeData) {
  try {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      console.error('인증 토큰이 없습니다.');
      return { success: false, error: '인증 토큰이 없습니다.' };
    }

    const response = await apiClient.post('/holdings/purchases', tradeData, {
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

    const response = await apiClient.post('/holdings/sales', tradeData, {
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

export const getMyPortfolioApi = () => {
  return apiClient.get('/holdings/mp');
};

// ✅ 예금 보유내역 조회
export const getDepositHoldingsApi = () => {
  return apiClient.get('/holdings/deposit'); // 토큰 자동 포함
};

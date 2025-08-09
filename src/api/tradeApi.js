import api from '@/api';

// 매수 함수
export async function purchaseProduct(tradeData) {
  try {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      console.error('인증 토큰이 없습니다.');
      return { success: false, error: '인증 토큰이 없습니다.' };
    }

    const response = await api.post('/holdings/purchases', tradeData, {
      headers: {
        Authorization: `Bearer ${token}`
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

    const response = await api.post('/holdings/sales', tradeData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('매도 성공:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('매도 실패:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

import apiClient from './index';

export const holdingsApi = {
  // 보유 내역 상세 조회
  getHoldingsDetails: async () => {
    const response = await apiClient.get('/holdings/details');
    return response.data;
  },

  // 보유 내역 요약 조회
  getHoldingsSummary: async () => {
    const response = await apiClient.get('/holdings/summary');
    return response.data;
  }
};

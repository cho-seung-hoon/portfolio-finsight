import apiClient from './index.js';

// 찜한 상품 미리보기 (통합)
export const getWatchPreview = async () => {
  const response = await apiClient.get('/watch/preview');
  return response.data;
};

// 찜한 상품 목록 조회
export const getWatchDeposits = async () => {
  const response = await apiClient.get('/watch/deposit');
  return response.data;
};

export const getWatchFunds = async () => {
  const response = await apiClient.get('/watch/fund');
  return response.data;
};

export const getWatchEtfs = async () => {
  const response = await apiClient.get('/watch/etf');
  return response.data;
};

// 찜한 상품 등록
export const addToWatch = async watchListDTO => {
  const response = await apiClient.post('/watch', watchListDTO);
  return response.data;
};

// 찜한 상품 해제
export const removeFromWatch = async (category, code) => {
  const response = await apiClient.delete(`/watch/${category}/${code}`);
  return response.data;
};

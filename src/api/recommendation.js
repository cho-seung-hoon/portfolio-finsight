// src/api/recommendation.js
import apiClient from './index.js';

/**
 * 최근 뉴스 기반 추천 상품 목록 조회
 * @param {number} top - 최대 추천 상품 개수
 * @returns {Promise<Array>} 추천 상품 배열
 */
export const getRecommendedProducts = async (top = 10) => {
  const res = await apiClient.get('/recommendations', {
    params: { top }
  });

  // ✅ 응답이 배열인 경우 그대로 반환
  return res.data;
};

// // src/api/recommendation.js
// import apiClient from './index.js';

// /**
//  * 최근 뉴스 기반 추천 상품 목록 조회
//  * @param {number} top - 최대 추천 상품 개수
//  * @returns {Promise<Array>} 추천 상품 배열
//  */
// export const getRecommendedProducts = async (top = 10) => {
//   const res = await apiClient.get('/recommendations', {
//     params: { top }
//   });

//   // ✅ 응답이 배열인 경우 그대로 반환
//   return res.data;
// };

// src/api/recommendation.js
import apiClient from './index.js';

let _cache = { data: [], at: 0, top: 0 };

/**
 * 최근 뉴스 기반 추천 상품 목록 조회 (간단 캐시 포함)
 * @param {number} top - 최대 추천 상품 개수
 * @param {number} ttlMs - 캐시 유지 시간(ms)
 * @returns {Promise<Array<{productCode:string, productCategory:string, score:number}>>}
 */
export const getRecommendedProducts = async (top = 10, ttlMs = 60_000) => {
  const now = Date.now();
  if (_cache.data.length && now - _cache.at < ttlMs && _cache.top === top) {
    return _cache.data;
  }

  const res = await apiClient.get('/recommendations', { params: { top } });
  const arr = Array.isArray(res.data) ? res.data : [];
  _cache = { data: arr, at: now, top };
  return arr;
};

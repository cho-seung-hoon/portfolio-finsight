import apiClient from './index.js';

export async function getDeposits(sort, is_matched, limit, offset) {
  try {
    const response = await apiClient.get('/products/deposit', {
      params: {
        sort,
        is_matched,
        limit,
        offset
      }
    });
    return response.data;
  } catch (err) {
    console.error('예금 목록 받아오는 API 호출 오류: ', err);
    return [];
  }
}

export async function getFunds(sort, country, type, is_matched, limit, offset) {
  try {
    const response = await apiClient.get('/products/fund', {
      params: {
        sort,
        country,
        type,
        is_matched,
        limit,
        offset
      }
    });
    return response.data;
  } catch (err) {
    console.error('펀드 목록 받아오는 API 호출 오류: ', err);
    return [];
  }
}

export async function getEtfs(sort, country, type, is_matched, limit, offset) {
  try {
    const response = await apiClient.get('/products/etf', {
      params: {
        sort,
        country,
        type,
        is_matched,
        limit,
        offset
      }
    });
    return response.data;
  } catch (err) {
    console.error('ETF 목록 받아오는 API 호출 오류: ', err);
    return [];
  }
}

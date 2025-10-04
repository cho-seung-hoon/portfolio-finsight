import apiClient from './index.js';

// 예금 목록 조회
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

// 펀드 목록 조회
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

// ETF 목록 조회
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

// 펀드 개별 조회
export async function getFundOneByCode(code) {
  try {
    const response = await apiClient.get(`/recommendations/fund/${code}`);
    return response.data;
  } catch (err) {
    console.error('펀드 개별 조회 API 호출 오류: ', err);
    throw err;
  }
}

// ETF 개별 조회
export async function getEtfOneByCode(code) {
  try {
    const response = await apiClient.get(`recommendations/etf/${code}`);
    return response.data;
  } catch (err) {
    console.error('ETF 개별 조회 API 호출 오류: ', err);
  }
}

// 상품 상세 정보 조회
export async function getProductDetail(category, productId) {
  try {
    const response = await apiClient.get(`/products/${category}/${productId}`);
    return response.data;
  } catch (err) {
    console.error('상품 상세 정보 API 호출 오류: ', err);
    throw err;
  }
}

// ETF 수익률 히스토리 조회
export async function getEtfHistory(productId) {
  try {
    const response = await apiClient.get(`/etf/${productId}/history`);
    return response.data;
  } catch (err) {
    console.error('ETF 수익률 히스토리 API 호출 오류: ', err);
    throw err;
  }
}

// 펀드 수익률 히스토리 조회
export async function getFundHistory(productId) {
  try {
    const response = await apiClient.get(`/fund/${productId}/history`);
    return response.data;
  } catch (err) {
    console.error('펀드 수익률 히스토리 API 호출 오류: ', err);
    throw err;
  }
}

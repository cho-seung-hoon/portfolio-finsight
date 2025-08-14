import apiClient from './index.js';

export async function getSearchSuggestions(word) {
  try {
    const response = await apiClient.get('/search/suggestions', {
      params: { word }
    });
    return response.data;
  } catch (err) {
    console.error('검색어 자동완성 GET API 호출 오류 :', err);
    throw err;
  }
}

export async function getSearchDeposits(word) {
  try {
    const response = await apiClient.get('/search', {
      params: {
        category: 'deposit',
        word
      }
    });
    return response.data;
  } catch (err) {
    console.error('예금 검색 목록 받아오는 API 호출 오류: ', err);
    return [];
  }
}

export async function getSearchFunds(word) {
  try {
    const response = await apiClient.get('/search', {
      params: {
        category: 'fund',
        word
      }
    });
    return response.data;
  } catch (err) {
    console.error('펀드 검색 목록 받아오는 API 호출 오류: ', err);
    return [];
  }
}

export async function getSearchEtfs(word) {
  try {
    const response = await apiClient.get('/search', {
      params: {
        category: 'etf',
        word
      }
    });
    return response.data;
  } catch (err) {
    console.error('ETF 검색 목록 받아오는 API 호출 오류: ', err);
    return [];
  }
}

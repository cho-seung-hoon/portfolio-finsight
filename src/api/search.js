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

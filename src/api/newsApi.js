// src/api/newsApi.js

import apiClient from './index.js';

export async function fetchKeywords() {
  try {
    const response = await apiClient.get('/news');
    return response.data;
  } catch (err) {
    console.error('Error fetching keywords:', err);
    return [];
  }
}

export async function fetchNewsByKeyword(keywordId) {
  try {
    const response = await apiClient.get(`/news/keyword/${keywordId}`);
    return response.data;
  } catch (err) {
    console.error('Error fetching news by keyword:', err);
    return null;
  }
}

export async function fetchNewsByProductCode(productCode) {
  try {
    const response = await apiClient.get(`/news/code/${productCode}`);
    return response.data;
  } catch (err) {
    console.error('Error fetching news by product code:', err);
    return [];
  }
}
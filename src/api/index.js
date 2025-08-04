// src/api/index.js

import axios from 'axios';

// 중앙 API 클라이언트 생성
const apiClient = axios.create({
  baseURL: '/api',
});

// 요청 인터셉터: 모든 요청에 토큰을 자동으로 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
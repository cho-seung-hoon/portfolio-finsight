// src/api/session.js
import apiClient from './index.js';

// 세션 연장
export async function refreshTokenApi() {
  return apiClient.post('/users/token');
}

// 로그아웃
export async function logoutApi(refreshToken) {
  return apiClient.post('/users/logout', { refreshToken }); // 토큰 자동 포함
}

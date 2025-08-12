// src/api/session.js
import apiClient from './index.js';

// 세션 연장
export async function refreshTokenApi(accessToken) {
  return apiClient.post(
    '/users/token',
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );
}

// 로그아웃
export async function logoutApi() {
  return apiClient.post('/users/logout');
}

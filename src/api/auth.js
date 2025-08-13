// src/api/auth.js
import apiClient from './index';

// ✅ 로그인
export const loginApi = (userId, password) => {
  return apiClient.post('/users/login', { userId, password });
};

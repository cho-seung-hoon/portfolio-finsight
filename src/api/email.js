// src/api/email.js
import apiClient from './index';

// 이메일 인증 코드 전송
export const sendEmailCode = email => {
  return apiClient.post('/users/email', { email });
};

// 이메일 인증 코드 검증
export const verifyEmailCode = (email, code) => {
  return apiClient.post('/users/authcode', { email, code });
};

// src/api/user.js
import apiClient from './index';

// 회원가입 요청
export const signUpUser = payload => {
  return apiClient.post('/users', payload);
};

// 아이디 중복 확인
export const checkUserIdExists = userId => {
  return apiClient.get('/users', { params: { userid: userId } });
};

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

// ✅ 추가: 유저 정보 조회
export const fetchUserInfoApi = () => {
  return apiClient.get('/users/info');
};

// ✅ 유저 정보 수정
export const updateUserInfoApi = payload => {
  return apiClient.put('/users/info', payload); // 토큰 자동 포함
};

// ✅ 추가: 투자성향 조회
export const fetchInvestmentProfileApi = () => {
  return apiClient.get('/users/invt');
};

// ✅ 회원 탈퇴
export const deleteUserApi = () => {
  return apiClient.delete('/users'); // 토큰 자동 포함
};

// ✅ 투자성향 결과 저장
export const updateInvestmentProfileApi = investmentProfileType => {
  return apiClient.put('/users/invt', { investmentProfileType });
};

// ✅ 투자성향 조회
export const getInvestmentProfileApi = () => {
  return apiClient.get('/users/invt');
};

// ✅ 내 정보 조회
export const getMyInfoApi = () => {
  return apiClient.get('/users/me'); // 토큰 자동 포함
};

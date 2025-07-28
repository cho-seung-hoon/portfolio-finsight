// src/stores/emailStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useEmailStore = defineStore('email', () => {
  const email = ref('');
  const code = ref('');
  const verified = ref(false);
  const error = ref('');
  const status = ref(''); // "success" | "error" | "conflict" | "unauthorized"

  // // ✅ 1. 인증코드 요청
  // const sendCode = async () => {
  //   try {
  //     const res = await axios.post('/users/email', { email: email.value });
  //     error.value = '';
  //     status.value = 'success';
  //     alert(res.data.message || '인증 코드가 전송되었습니다.');
  //   } catch (e) {
  //     if (e.response?.status === 409) {
  //       error.value = '이미 가입된 이메일입니다.';
  //       status.value = 'conflict';
  //     } else {
  //       error.value = '인증코드 전송 실패';
  //       status.value = 'error';
  //     }
  //     throw e; // 프론트에서 catch 가능
  //   }
  // };

  // emailStore.js 수정
  const sendCode = async () => {
    try {
      const res = await axios.post('/users/email', { email: email.value });
      error.value = '';
      status.value = 'success';
      return res.data.message || '인증 코드가 전송되었습니다.';
    } catch (e) {
      if (e.response?.status === 409) {
        error.value = '이미 가입된 이메일입니다.';
        status.value = 'conflict';
      } else {
        error.value = '인증코드 전송 실패';
        status.value = 'error';
      }
      throw new Error(error.value);
    }
  };

  // ✅ 2. 인증코드 확인
  const verifyCode = async () => {
    try {
      const res = await axios.post('/users/authcode', {
        email: email.value,
        code: code.value
      });
      verified.value = res.data.verified === true;
      if (verified.value) {
        error.value = '';
        status.value = 'success';
        // alert('이메일 인증 성공!');
      } else {
        error.value = '인증 코드가 일치하지 않습니다.';
        status.value = 'unauthorized';
      }
    } catch (e) {
      error.value = '인증 확인 실패';
      status.value = 'error';
      verified.value = false;
    }
  };

  return {
    email,
    code,
    verified,
    error,
    status,
    sendCode,
    verifyCode
  };
});

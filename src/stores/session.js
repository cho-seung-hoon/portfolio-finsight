// src/stores/session.js

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { decodingJWT } from '@/utils/jwtUtil';
import { refreshTokenApi, logoutApi } from '@/api/session';
import { loginApi } from '@/api/auth';
import { getMyInfoApi } from '@/api/user';

export const useSessionStore = defineStore('session', () => {
  const isExpireModalVisible = ref(false);
  const remainingTime = ref('00:00');
  const modalMode = ref('countdown');
  let intervalId = null;


  const accessToken = ref(null);
  const user = ref(null);

  const isAuthenticated = computed(() => !!accessToken.value);

  const stopCountdown = () => {
    if (intervalId) clearInterval(intervalId);
  };

  const updateRemainingTime = () => {
    const token = accessToken.value;

    if (!token) {
      remainingTime.value = '정보 없음';
      stopCountdown();
      return;
    }

    const timeObj = decodingJWT(token);

    if (!token || timeObj === null) {
      remainingTime.value = '정보 없음';
      return;
    }

    if (timeObj === '만료됨') {
      remainingTime.value = '만료됨';
      modalMode.value = 'expired';
      isExpireModalVisible.value = true;
      stopCountdown();
      // logout(); // 만료 시 자동 로그아웃 로직 (필요시 활성화)
      return;
    }

    const totalSeconds = timeObj.minutes * 60 + timeObj.seconds;
    remainingTime.value = `${String(timeObj.minutes).padStart(2, '0')}:${String(timeObj.seconds).padStart(2, '0')}`;

    if (totalSeconds <= 180 && !isExpireModalVisible.value) {
      modalMode.value = 'countdown';
      isExpireModalVisible.value = true;
    }
  };

  const startCountdown = () => {
    stopCountdown();
    updateRemainingTime();
    intervalId = setInterval(updateRemainingTime, 1000);
  };

  const extendSession = async () => {
    try {
      const { data } = await refreshTokenApi(accessToken.value);

      accessToken.value = data;
      isExpireModalVisible.value = false;
      startCountdown();
    } catch (error) {
      console.error('세션 연장 실패:', error);
      logout();
    }
  };

  const logout = async () => {
    try {
      if (accessToken.value) {
        await logoutApi(accessToken.value);
      }
    } catch (e) {
      console.warn('서버 로그아웃 실패', e);
    }

    accessToken.value = null;
    user.value = null;
    stopCountdown();

    modalMode.value = 'expired'
    isExpireModalVisible.value = false;
    remainingTime.value = '정보 없음';
  };

  const login = async (loginData) => {
    const loginResponse = await loginApi(loginData.id, loginData.password);
    accessToken.value = loginResponse.data.accessToken;
    const userInfoResponse = await getMyInfoApi();
    user.value = userInfoResponse.data;

    startCountdown();

    return user.value.userRole;
  }

  return {

    isExpireModalVisible,
    remainingTime,
    modalMode,
    startCountdown,
    stopCountdown,
    extendSession,
    logout,
    accessToken,
    user,
    isAuthenticated,
    login,
  };
}, {
  persist: {
    key: 'finsight-session',
    serializer: {
      serialize: (state) => {
        if (state.accessToken) {
          return JSON.stringify({ accessToken: state.accessToken });
        }
        return null;
      },
      deserialize: (value) => {
        if (typeof value === 'string') {
          return JSON.parse(value);
        }
        return {};
      }
    }
  }
});
// src\stores\session.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { decodingJWT } from '@/utils/jwtUtil';
import { refreshTokenApi, logoutApi } from '@/api/session';

export const useSessionStore = defineStore('session', () => {
  const isExpireModalVisible = ref(false);
  const remainingTime = ref('00:00');
  let intervalId = null;
  const router = useRouter();

  const startCountdown = () => {
    stopCountdown();
    updateRemainingTime();
    intervalId = setInterval(updateRemainingTime, 1000);
  };

  const stopCountdown = () => {
    if (intervalId) clearInterval(intervalId);
  };

  const modalMode = ref('countdown'); // 🔹 'countdown' or 'expired'
  const updateRemainingTime = () => {
    const token = localStorage.getItem('accessToken');

    // ✅ 토큰 없으면 즉시 종료
    if (!token) {
      remainingTime.value = '정보 없음';
      return;
    }

    const timeObj = decodingJWT(token);

    if (!token || timeObj === null) {
      remainingTime.value = '정보 없음';
      return;
    }

    // ✅ 토큰 만료된 경우
    if (timeObj === '만료됨') {
      remainingTime.value = '만료됨';
      modalMode.value = 'expired'; // ✅ 모드 전환
      isExpireModalVisible.value = true; // 모달 표시

      // if (router.currentRoute.value.path !== '/start') {
      //   logout(); // 자동 로그아웃 + /start 이동
      // }
      logout();
      return;
    }

    const totalSeconds = timeObj.minutes * 60 + timeObj.seconds;
    remainingTime.value = `${String(timeObj.minutes).padStart(2, '0')}:${String(timeObj.seconds).padStart(2, '0')}`;

    // ✅ 30초 이하 남으면 countdown 모드로 모달 표시
    if (totalSeconds <= 30 && !isExpireModalVisible.value) {
      modalMode.value = 'countdown';
      isExpireModalVisible.value = true;
    }
  };

  const extendSession = async () => {
    const accessToken = localStorage.getItem('accessToken');
    console.log(accessToken);
    try {
      const { data } = await refreshTokenApi(accessToken);
      localStorage.setItem('accessToken', data);
      isExpireModalVisible.value = false;
      startCountdown();
      console.log('로그인 연장 성공:', data.success);
    } catch (error) {
      console.error('세션 연장 실패:', error);
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (e) {
      console.warn('서버 로그아웃 실패', e);
    }
    localStorage.removeItem('accessToken');
    if (modalMode.value !== 'expired') {
      isExpireModalVisible.value = false;
    }
    stopCountdown();
    router.push('/start');
  };

  return {
    isExpireModalVisible,
    remainingTime,
    modalMode,
    startCountdown,
    stopCountdown,
    extendSession,
    logout
  };
});

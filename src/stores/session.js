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

  const updateRemainingTime = () => {
    const token = localStorage.getItem('accessToken');

    // ✅ 토큰 없으면 즉시 종료 (디코딩 안 함)
    if (!token) {
      remainingTime.value = '정보 없음';
      return;
    }

    const timeObj = decodingJWT(token);

    if (!token || timeObj === null) {
      remainingTime.value = '정보 없음';
      return;
    }

    if (timeObj === '만료됨') {
      remainingTime.value = '만료됨';
      if (router.currentRoute.value.path !== '/start') {
        logout();
      }
      return;
    }

    const totalSeconds = timeObj.minutes * 60 + timeObj.seconds;
    remainingTime.value = `${String(timeObj.minutes).padStart(2, '0')}:${String(timeObj.seconds).padStart(2, '0')}`;

    // 3분 이하 남았을 때만 모달 표시
    if (totalSeconds <= 180 && !isExpireModalVisible.value) {
      isExpireModalVisible.value = true;
    }
  };

  const extendSession = async () => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const { data } = await refreshTokenApi(accessToken);
      localStorage.setItem('accessToken', data.data);
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
    isExpireModalVisible.value = false;
    stopCountdown();
    router.push('/start');
  };

  return {
    isExpireModalVisible,
    remainingTime,
    startCountdown,
    stopCountdown,
    extendSession,
    logout
  };
});

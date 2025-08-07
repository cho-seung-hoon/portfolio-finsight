<template>
  <div
    class="bottom-modal-overlay"
    @click.self="$emit('cancel')">
    <div class="bottom-modal">
      <div class="bottom-modal-header">
        <p class="bottom-modal-sub-title">
          <span>{{ userInfo.userName }}</span>
          <span>님의 투자성향은</span>
          <span :class="['invt', profileClass]">{{ investmentProfileType }}</span>
        </p>
        <div class="bottom-modal-title">
          <span :class="['invt', profileClass]">{{ investmentProfileType }}</span>
          <span>에게 추천하는 상품을 보여드릴게요!</span>
        </div>
      </div>

      <!-- Graph Section start -->
      <div>
        <img
          v-if="investmentProfileType === '안정형'"
          src="@/assets/image/recommend_01_stable.png"
          alt="stableChart"
          class="bottom-modal-img" />
        <img
          v-if="investmentProfileType === '안정추구형'"
          src="@/assets/image/recommend_02_stableplus.png"
          alt="stableplusChart"
          class="bottom-modal-img" />
        <img
          v-if="investmentProfileType === '위험중립형'"
          src="@/assets/image/recommend_03_neutral.png"
          alt="neutralChart"
          class="bottom-modal-img" />
        <img
          v-if="investmentProfileType === '적극투자형'"
          src="@/assets/image/recommend_04_aggressive.png"
          alt="aggressiveChart"
          class="bottom-modal-img" />
        <img
          v-else-if="investmentProfileType === '공격투자형'"
          src="@/assets/image/recommend_05_veryaggresive.png"
          alt="veryaggressiveChart"
          class="bottom-modal-img" />
      </div>
      <!-- Graph Section end -->
        
      <div class="bottom-modal-footer">
        <button
          class="bottom-modal-footer-btn"
          @click="$emit('cancel')">
          취소
        </button>
        <button
          class="invt-bottom-modal-footer-btn"
          @click="$emit('confirm')">
          확인
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import axios from 'axios';

const investmentProfileType = ref('');
onMounted(() => {
  fetchInvestmentProfile();
  fetchUsersInfo();
});

const userInfo = ref({
  userName: ''
});
const fetchUsersInfo = async () => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.get('http://localhost:8080/users/info', {
      headers: { Authorization: `Bearer ${token}` },
    });
    userInfo.value = response.data.data;
  } catch (e) {
    console.error('유저 정보 불러오기 실패:', e);
  }
};

const fetchInvestmentProfile = async () => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    console.error('accessToken이 없습니다.');
    return;
  }
  try {
    const response = await axios.get(
      'http://localhost:8080/users/invt',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const type = response.data.investmentProfileType;
      investmentProfileType.value = translateProfileType(type);
      profileClass.value = getProfileClass(type);
      console.log('투자성향결과:', type);

    } catch (error) {
      console.error('투자성향 조회 실패:', error);
  }
};
const profileClass = ref('');
const translateProfileType = (type) => {
  switch (type) {
    case 'stable':
      return '안정형';
    case 'stableplus':
      return '안정추구형';
    case 'neutral':
      return '위험중립형';
    case 'aggressive':
      return '적극투자형';
    case 'veryaggressive':
      return '공격투자형';
    default:
      return '알 수 없음';
  }
};
const getProfileClass = (type) => {
  switch (type) {
    case 'stable': return 'highlight-stable';
    case 'stableplus': return 'highlight-stableplus';
    case 'neutral': return 'highlight-neutral';
    case 'aggressive': return 'highlight-aggressive';
    case 'veryaggressive': return 'highlight-veryaggressive';
    default: return '';
  }
};
</script>

<style scoped>
.bottom-modal-overlay {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: rgba(20, 24, 44, 0.13);
  z-index: 999;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  transition: background 0.3s ease-out;
}

.bottom-modal {
  width: 100%;
  max-width: 440px;
  background: var(--white);
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -2px 16px rgba(20, 24, 44, 0.08);
  padding: 60px 20px;
  box-sizing: border-box;
  transition: transform 0.3s ease-out;
}

@media (max-width: 768px) {
  .bottom-modal {
    max-width: 100vw;
  }
}

.bottom-modal-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.bottom-modal-sub-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-regular);
  color: var(--main02);
}

.bottom-modal-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semi-bold);
  color: var(--main01);
  text-align: center;
  line-height: 26px;
}

.bottom-modal-img {
  display: block;
  width: 80%;
  margin: 50px auto;
  margin-bottom: -20px;
}

.bottom-modal-footer {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 80px;
}

.bottom-modal-footer-btn {
  background: var(--main04);
  color: var(--main02);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-regular);
  padding: 8px 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.invt-bottom-modal-footer-btn {
  background: var(--main01);
  color: var(--main05);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-regular);
  padding: 8px 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.slide-up-enter-from .bottom-modal,
.slide-up-leave-to .bottom-modal {
  transform: translateY(100%);
}

.slide-up-enter-from.bottom-modal-overlay,
.slide-up-leave-to.bottom-modal-overlay {
  background: rgba(20, 24, 44, 0);
}

.slide-up-enter-active .bottom-modal,
.slide-up-leave-active .bottom-modal,
.slide-up-enter-active.bottom-modal-overlay,
.slide-up-leave-active.bottom-modal-overlay {
  transition:
    transform 0.3s ease-out,
    background 0.3s ease-out;
}

.slide-up-enter-to .bottom-modal,
.slide-up-leave-from .bottom-modal {
  transform: translateY(0);
}

.slide-up-enter-to.bottom-modal-overlay,
.slide-up-leave-from.bottom-modal-overlay {
  background: rgba(20, 24, 44, 0.13);
}

/* Highlight styles */
.highlight-blue {
  color: var(--text-blue);
  font-weight: bold;
}
.highlight-red {
  color: var(--text-red);
  font-weight: bold;
}

.highlight-stable {
  color: var(--mint01);
  font-weight: bold;
}
.highlight-stableplus {
  color: var(--green01);
  font-weight: bold;
}
.highlight-neutral {
  color: var(--yellow01);
  font-weight: bold;
}
.highlight-aggressive {
  color: var(--orange01);
  font-weight: bold;
}
.highlight-veryaggressive {
  color: var(--red01);
  font-weight: bold;
}
</style>

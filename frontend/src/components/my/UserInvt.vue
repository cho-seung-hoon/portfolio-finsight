<template>
  <div class="subBox2">
    <div class="subItem-title">나의 투자 성향</div>
    <div class="subItem-content">
      <!-- <div class="invt">안정형</div> -->
      <!-- <div class="invt">{{ investmentProfileType }}</div> -->
      <div :class="['invt', profileClass]">{{ investmentProfileType }}</div>

      <button @click="handleRetakeClick">투자 성향 분석</button>
    </div>
  </div>
  <!-- 통합해야할 모달창 -->
  <!-- <div
    v-if="showModal"
    class="modal-backdrop">
    <div class="modal">
      <h2>투자성향분석 안내</h2>
      <br />
      <p>
        본 투자성향분석은 <strong class="highlight-blue">대면/비대면</strong>을 <br />포함하여
        <strong class="highlight-red">1일 1회</strong>만 가능합니다.
      </p>
      <br />
      <button @click="showModal = false">확인</button>
    </div>
  </div> -->
  <BaseModal
    :visible="showModal"
    :onClose="() => (showModal = false)">
    <template #default>
      본 투자성향분석은 <span class="highlight-blue">대면/비대면</span>을 <br />포함하여
      <span class="highlight-red">1일 1회</span>만 가능합니다.
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BaseModal from '@/components/common/BaseModal.vue';
import { fetchInvestmentProfileApi } from '@/api/user';
import { storeToRefs } from 'pinia';
import { useSessionStore } from '@/stores/session';
import { useRouter } from 'vue-router';

const router = useRouter();
const sessionStore = useSessionStore();
const { user: userInfo } = storeToRefs(sessionStore);

const investmentProfileType = ref('');
const profileClass = ref('');
const canRetakeTest = ref(false);
const showModal = ref(false);

onMounted(() => {
  fetchInvestmentProfile();
});

// 투자 성향 API 호출 (백엔드에 GET 요청 보내기)
const fetchInvestmentProfile = async () => {
  try {
    const response = await fetchInvestmentProfileApi();
    const type = response.data.investmentProfileType;
    investmentProfileType.value = translateProfileType(type);
    profileClass.value = getProfileClass(type);

    const updatedAt = response.data.investmentProfileUpdatedAt;
    canRetakeTest.value = isOver24Hours(updatedAt);
  } catch (error) {
    console.error('투자성향 조회 실패:', error);
  }
};

//  GET 받은 투자 성향을 변환하는 로직
const translateProfileType = type => {
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

const getProfileClass = type => {
  switch (type) {
    case 'stable':
      return 'highlight-stable';
    case 'stableplus':
      return 'highlight-stableplus';
    case 'neutral':
      return 'highlight-neutral';
    case 'aggressive':
      return 'highlight-aggressive';
    case 'veryaggressive':
      return 'highlight-veryaggressive';
    default:
      return '';
  }
};

// 날짜 비교 로직
const isOver24Hours = updatedAtStr => {
  const updatedDate = new Date(updatedAtStr);
  const now = new Date();
  const diffInMs = now - updatedDate;
  const diffInHours = diffInMs / (1000 * 60 * 60);
  return diffInHours >= 24;
};


const handleRetakeClick = () => {
  console.log('canRetakeTest:', canRetakeTest.value);

  if (!canRetakeTest.value) {
    showModal.value = true;
    return;
  }
  router.push('/inv-type-main-page');
};
</script>

<style scoped>
.subBox2 {
  margin: 25px 0;
  background-color: var(--white);
  border-radius: 8px;
  height: 100px;
  padding: 20px;
  border:1px solid var(--main04);
}

.subItem-title {
  color: var(--main02);
  font-size: var(--font-size-sm);
}

.subItem-content {
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24px;
}

button {
  all: unset;
  padding: 6px 10px;
  background-color: var(--sub01);
  color: var(--white);
  font-size: var(--font-size-ms);
  cursor: pointer;
  border-radius: 6px;
  pointer-events: auto;
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
/* .modal {
  background-color: white;
  padding: 24px 24px 10px 24px;
  border-radius: 10px;
  text-align: center;
  max-width: 300px;
  z-index: 1001;
}
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
} */
</style>

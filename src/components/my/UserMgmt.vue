<template>
  <div class="subBox2">
    <div
      class="action"
      @click="logout">
      로그아웃
    </div>

    <!-- ✅ 로그아웃 성공 모달 -->
    <!-- <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <p>로그아웃 되었습니다. 이용해주셔서 감사합니다.</p>
        <button @click="closeModal">확인</button>
      </div>
    </div> -->
    <BaseModal
      :visible="showModal"
      :onClose="closeModal">
      <template #default>
        로그아웃 되었습니다.<br />
        이용해주셔서 감사합니다.
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { logoutApi } from '@/api/session';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import BaseModal from '../common/BaseModal.vue';
import { useSessionStore } from "@/stores/session"
const showModal = ref(false);

const router = useRouter();
const sessionStore = useSessionStore();

const logout = async () => {
  try {
    // ✅ 모든 복잡한 로직은 스토어의 logout 액션에 맡깁니다.
    await sessionStore.logout();

    // 로그아웃 액션이 성공적으로 끝나면 모달을 띄웁니다.
    showModal.value = true;

  } catch (error) {
    console.error('로그아웃 실패:', error);
    alert('로그아웃 중 오류가 발생했습니다.');
  }
};

const closeModal = () => {
  showModal.value = false;
  localStorage.removeItem('finsight-session');
  router.push('/start');
};
</script>

<style scoped>
.subBox2 {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center; /* 중앙 정렬 */
  gap: 16px; /* 요소 간 간격 */
}

.action {
  font-size: var(--font-size-sm);
  color: var(--main02); /* 원하는 색상 */
  cursor: pointer;
}
/* ✅ 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 24px 32px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal button {
  margin-top: 16px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
}
</style>

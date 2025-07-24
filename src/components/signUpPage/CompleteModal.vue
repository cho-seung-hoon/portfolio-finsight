<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <div class="check-icon">✔</div>
      <div class="message">회원 가입 완료</div>

      <!-- 회색 구분선 추가 -->
      <hr class="divider" />

      <button
        class="confirm-btn"
        @click="goToLogin">
        확인
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
const goToLogin = () => router.push('/login');
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  width: 280px;
  padding: 32px 20px 24px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.check-icon {
  font-size: 32px;
  color: #f97b6d;
  margin-bottom: 16px;
}

.message {
  font-size: 16px;
  font-weight: bold;
  color: #222;
  margin-bottom: 50px; /* ✅ 간격 넓힘 */
}

.divider {
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 0 0 16px;
}

.confirm-btn {
  width: 100%;
  background-color: #111e3d;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 0;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
}
</style>

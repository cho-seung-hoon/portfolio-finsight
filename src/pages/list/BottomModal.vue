<template>
  <div
    class="bottom-modal-overlay"
    @click.self="$emit('cancel')">
    <div class="bottom-modal">
      <div class="bottom-modal-header">
        <p class="bottom-modal-sub-title">다인님의 투자성향은 위험중립형</p>
        <div class="bottom-modal-title">
          안정추구형에게 추천하는<br />
          상품을 보여드릴게요!
        </div>
      </div>
      <img
        class="bottom-modal-img"
        :src="RecommendImg"
        alt="투자 성향 이미지" />
      <div class="bottom-modal-footer">
        <button
          class="bottom-modal-footer-btn"
          @click="$emit('cancel')">
          취소
        </button>
        <button
          class="bottom-modal-footer-btn primary"
          @click="$emit('confirm')">
          확인
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import RecommendImg from '@/assets/image/recommend_02_stableplus.png';
</script>

<style scoped>
.bottom-modal-overlay {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: rgba(20, 24, 44, 0.13);
  z-index: 999;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.bottom-modal {
  width: 100%;
  max-width: 440px;
  background: var(--white);
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -2px 16px rgba(20, 24, 44, 0.08);
  padding: 60px 20px;
  box-sizing: border-box;
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
  width: 90%;
  margin: 50px auto;
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

.bottom-modal-footer-btn.primary {
  background: #28ca6e;
  color: var(--white);
}
</style>

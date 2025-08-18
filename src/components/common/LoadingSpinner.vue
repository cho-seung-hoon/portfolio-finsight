<template>
  <div class="loading-spinner-container">
    <div class="loading-spinner">
      <div class="character-wrapper">
        <img
          src="@/assets/moving_bear2.gif"
          alt="로딩 캐릭터"
          class="loading-character" />
        <div class="spinner"></div>
      </div>

      <transition name="text-cross-fade" mode="out-in">
        <p :key="text" class="loading-text">{{ text }}</p>
      </transition>

    </div>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: '잠시만 기다려주세요...'
  }
});
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 텍스트 교차 페이드 애니메이션 */
.text-cross-fade-enter-active,
.text-cross-fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}
.text-cross-fade-enter-from,
.text-cross-fade-leave-to {
  opacity: 0;
}

.loading-spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  padding-bottom: 10vh;
  box-sizing: border-box;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.character-wrapper {
  position: relative;
  width: 140px;
  height: 140px;
  display: flex;
  justify-content: center;
  align-items: center;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.1));
}

.loading-character {
  width: 100px;
  height: 100px;
  object-fit: contain;
  z-index: 2;
}

.spinner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;

}


.spinner::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border-radius: 50%;
  /* conic-gradient로 원뿔형 그라데이션 생성 */
  background: conic-gradient(
    from 90deg,
    #2C3A5C, /* 기본 색상 (더 진하게) */
    #8A9ACC, /* 하이라이트 (더 선명하게) */
    #2C3A5C  /* 다시 기본 색상으로 */
  );
  animation: spin 1.2s linear infinite;

  /* mask를 이용해 가운데를 뚫어 링 모양 생성 */
  mask-image: radial-gradient(transparent 65%, black 66%);
}


.loading-text {
  margin-top: 24px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.2px;
  color: transparent;

  background: linear-gradient(
    90deg,
    #2C3A5C, /* 기본 색상 (더 진하게) */
    #8A9ACC, /* 하이라이트 (더 선명하게) */
    #2C3A5C  /* 다시 기본 색상으로 */
  );

  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  animation: shimmer 2s linear infinite;
}
@keyframes shimmer {
  0% {
    background-position: 200% center;
  }
  100% {
    background-position: -200% center;
  }
}
</style>
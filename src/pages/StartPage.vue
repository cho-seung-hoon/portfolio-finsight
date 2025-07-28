<template>
  <div class="intro-page">
    <!-- 상단 캐릭터 이미지 -->
    <img
      src="@/assets/cha2.png"
      alt="Fin-Sight 캐릭터"
      class="intro-image" />

    <!-- 문구 -->
    <h2 class="title">당신만을 위한 <span class="highlight">Fin-Sight</span></h2>
    <p class="description">
      감성분석 기반의 뉴스정보와<br />
      내 투자 유형으로 쉽게 알아보는<br />
      재테크 상품 비교 서비스<br /><br />
      지금 바로 시작해보세요!
    </p>

    <!-- 시작 버튼 -->
    <button
      class="start-button"
      @click="goToLogin">
      지금 시작하기
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.intro-page {
  background-color: #0e1830;
  height: 100vh;
  color: white;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  margin: 0 -20px;
}

.intro-image {
  width: 180px;
  margin-bottom: 30px;
}

.title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
}

.highlight {
  color: #ffffff;
  font-weight: bold;
}

.description {
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-line;
  margin-bottom: 30px;
}

.start-button {
  background-color: #ff8f7f;
  border: none;
  border-radius: 8px;
  padding: 12px 48px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  cursor: pointer;
}
.start-button:hover {
  opacity: 0.9;
}
</style>

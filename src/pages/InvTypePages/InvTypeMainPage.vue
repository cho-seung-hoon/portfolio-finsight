<!-- 
작성자: JY
작성일자: 2025-07-25
페이지명: 투자성향분석-최초페이지
    [경로]
    path: '/inv-type-main-page',
    name: 'InvTypeMainPage',
    component: InvTypeMainPage
-->
<template>
  <div class="main-section">
    <!-- FigureSection -->
    <img
      src="/src/assets/cha2.png"
      alt="stableChart"
      class="figure-image" />
    <p class="main-title">
      Fin-Sight가 투자성향별<br />
      맞춤 <span class="highlight-sub highlight-font">자산배분안</span>을 알려드려요 !
    </p>
    <button
      class="next-button"
      @click="goToNext">
      나의 투자성향 분석하러가기
    </button>
  </div>
</template>

<script setup>
// imports
import { useRouter } from 'vue-router';

// func.
const router = useRouter();
const goToNext = () => {
  router.push('/inv-type-test-step-1-page');
};
</script>

<style scoped>
/* TitleSection styles */
.main-section {
  background: var(--main04);
  padding: 200px 50px 100px 50px;
  text-align: left;
  width: calc(100% + 40px);
  margin-left: -20px;
  margin-right: -20px;
}
.main-title {
  font-size: 28px;
  font-weight: bold;
  color: black;
  padding: 20px 75px 50px 75px;
}

/* NextButton styles */
.next-button {
  padding: 16px 16px;
  background: var(--main01);
  color: var(--main05);
  border-radius: 30px;
  font-size: 24px;
  font-weight: bold;
  width: calc(80%);
  cursor: pointer;
  display: block;
  margin: 0 auto;
  transition:
    transform 1s ease,
    box-shadow 0.1s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}
.next-button:active {
  transform: scale(0.8);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.next-button:hover {
  transform: scale(1.02);
}
/* FigureSection styles */
.figure-image {
  display: block;
  width: 300px; /* 너비 조절 */
  height: auto; /* 비율 유지 */
  margin: 0 auto;
  padding-bottom: 50px;
}
/* Highlight styles */
.highlight-sub {
  color: var(--sub01);
  font-weight: bold;
}
.highlight-font {
  font-size: 34px;
}
</style>

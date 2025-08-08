<!-- 
작성자: JY
작성일자: 2025-07-29
페이지명: 투자성향분석-최초페이지
  [경로]
    path: '/inv-type-main-page',
    name: 'InvTypeMainPage',
    component: InvTypeMainPage
-->

<template>
<!-- Main Section start -->
  <div class="main-section">

    <!-- Figure Section -->
    <img src="/src/assets/moving_bear.gif" alt="MainChar" class="figure-image">

    <!-- Text Section -->
    <div class="middle">
      <div class="main-title">
        Fin-Sight에서 투자성향별<br>
        <span class="highlight-sub">자산배분안</span>을 확인해보아요 !!
      </div>
    </div>
    <!-- Button Section -->
    <button class="next-button" @click="goToNext">
      나의 투자성향 분석하기
    </button>
  </div>
<!-- Main Section end -->
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
/* Main Section Styles */
.main-title.middle {
  display: block;
  align-items: center;
}
.main-section {
  text-align: left;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 수직 중앙 */
  align-items: center;     /* 수평 중앙 */
  padding: 20px 0 60px 0;
  position: relative;
}

/* Main - Figure Section Styles */
.figure-image {
  display: block;
  width: 160px; /* 너비 조절 */
  /*height: auto;*/ /* 비율 유지 */
  margin: 0 auto 10px;
}

/* Main - Text Section Styles */
.main-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semi-bold);
  color: var(--main01);
  max-width: 340px;
  line-height: 1.6;
  /* display: flex; */
  align-items: center;
}

/* Button Section Styles */
.next-button{
  position:absolute;
  bottom:60px;
  padding: 16px 16px;
  background: var(--main01);
  color: var(--main05);
  border-radius: 8px;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  width:100%;
  cursor: pointer;
  /*display: block;
  margin: 0 auto;*/
  /*transition:
    transform 1s ease,
    box-shadow 0.1s ease;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);*/
}
.next-button:active {
  transform: scale(0.9);
  /*box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);*/
}
.next-button:hover {
  transform: scale(1.02);
}

/* Highlight Styles */
.highlight-sub {
  color: var(--sub01);
  font-weight: var(--font-weight-extra-bold);
}
</style>

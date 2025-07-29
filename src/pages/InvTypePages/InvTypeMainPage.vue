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
    <img src="/src/assets/cha2.png" alt="MainChar" class="figure-image">

    <!-- Text Section -->
    <p class="main-title">
      Fin-Sight가<br>
      투자성향별 맞춤<br>
      <span class="highlight-sub">자산배분안</span>을 알려드려요 !
    </p>

    <!-- Button Section -->
    <button class="next-button" @click="goToNext">
      나의 투자성향 분석하기
    </button>
  </div>
<!-- Main Section end -->
</template>


<script setup>
// imports
import { useRouter } from 'vue-router'

// func.
const router = useRouter()
const goToNext = () => {
    router.push('/inv-type-test-step-1-page')
}
</script>


<style scoped>
/* Main Section Styles */
.main-section {
  background: var(--main04);
  text-align: left;
  width: calc(100% + 40px);
  margin: 0 -20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 수직 중앙 */
  align-items: center;     /* 수평 중앙 */
  padding: 0 20px;
}

/* Main - Figure Section Styles */
.figure-image {
  display: block;
  width: 250px; /* 너비 조절 */
  height: auto; /* 비율 유지 */
  margin: 0 auto;
  padding-bottom: 50px;
}

/* Main - Text Section Styles */
.main-title {
  font-size: 20px;
  font-weight: bold;
  color: black;
  padding: 20px 50px 20px 50px;
}

/* Button Section Styles */
.next-button{
  padding: 16px 16px;
  background: var(--main01);
  color: var(--main05);
  border-radius: 30px;
  font-size: 20px;
  font-weight: bold;
  width: calc(80%);
  cursor: pointer;
  display: block;     
  margin: 0 auto;
  transition: transform 1s ease, box-shadow 0.1s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}
.next-button:active {
  transform: scale(0.80);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.next-button:hover {
  transform: scale(1.02);
}

/* Highlight Styles */
.highlight-sub {
  color: var(--sub01);
  font-weight: bold;
}
</style>
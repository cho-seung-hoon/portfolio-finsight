<!-- 
작성자: JY
작성일자: 2025-07-25
페이지명: 투자성향분석-1단계-페이지
    [경로]
    path: '/inv-type-test-step-1-page',
    name: 'InvTypeTestStep1Page',
    component: InvTypeTestStep1Page
-->
<template>
  <!-- TitleSection start-->
  <div class="main-section">
    <h1 class="main-title">투자성향분석</h1>
  </div>
  <br />
  <!-- TitleSection end-->

  <!-- QuestionSection start-->
  <div class="question-box">
    <h2 class="question-title">고객님의 금융소비자 유형을 선택해주세요.</h2>
    <div class="check-button-group">
      <button
        :class="['check-button', { active: consumerType === '일반' }]"
        @click="consumerType = '일반'">
        일반금융소비자
      </button>
      <button
        :class="['check-button', { active: consumerType === '전문' }]"
        @click="consumerType = '전문'">
        전문금융소비자<br />(영업점가입대상)
      </button>
    </div>

    <!-- GuideLink Section -->
    <div
      class="guide-link"
      @click="goToNotion">
      전문금융소비자 안내 &gt;
    </div>
  </div>

  <div class="question-box">
    <h2 class="question-title">다음의 금융취약소비자에 해당하십니까?</h2>
    <ul class="list-section">
      <li class="sub-section-list">고령자(만 65세 이상)</li>
      <li class="sub-section-list">은퇴자 또는 주부</li>
      <li class="sub-section-list">금융투자상품 가입시 유의사항 안내가 필요한 분</li>
    </ul>
    <div class="check-button-group">
      <button
        :class="['check-button', { active: isVulnerable === false }]"
        @click="isVulnerable = false">
        아니오
      </button>
      <button
        :class="['check-button', { active: isVulnerable === true }]"
        @click="isVulnerable = true">
        예
      </button>
    </div>
  </div>

  <div class="question-box">
    <h2 class="question-title">
      <span class="highlight-blue">최근 1개월 </span>이내 대출을 받았거나,
      <span class="highlight-blue">앞으로 1개월 이내</span> 대출을 받을 예정인가요?
    </h2>
    <div class="check-button-group">
      <button
        :class="['check-button', { active: hasLoan === false }]"
        @click="hasLoan = false">
        아니오
      </button>
      <button
        :class="['check-button', { active: hasLoan === true }]"
        @click="hasLoan = true">
        예
      </button>
    </div>
  </div>
  <!-- MainSection end-->

  <!-- CompleteButton -->
  <button
    class="main-section complete-button"
    @click="goToNext">
    다음 단계로
  </button>
</template>

<script setup>
// imports
import { useRouter } from 'vue-router';

// func.
const router = useRouter();
const goToNotion = () => {
  router.push('/inv-type-notice-page');
};
const goToNext = () => {
  router.push('/inv-type-test-step-2-page');
};

// import { ref } from 'vue'
// import axios from 'axios'

// const consumerType = ref('')

// const InvType = async () => {
//     try {
//         await axios.post('/api/inv-type', {
//             type: consumerType.value
//         })
//         alert('저장 완료!')
//     } catch (error) {
//         console.error('저장 실패:', error)
//         alert('저장에 실패했어요 😢')
//     }
// }
</script>

<style scoped>
/* TitleSection styles */
.main-section {
  background: var(--main01);
  padding: 32px 32px 24px 32px;
  text-align: left;
  width: calc(100% + 40px);
  margin-left: -20px;
  margin-right: -20px;
}
.main-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--main05);
}

/* QuestionSection styles */
.question-box {
  margin: 0px 32px 10px 32px;
  border: 1.5px solid var(--main04);
  border-radius: 5px;
  background-color: var(--main05);
  height: auto;
}
.question-title {
  margin: 20px 40px 20px 40px;
  font-size: 15px;
}

/* MainSection styles */
.sub-section {
  margin-bottom: 30px;
  border: 1.5px solid var(--main04);
  border-radius: 5px;
  background-color: var(--main05);
  height: auto;
}

/* CheckButton styles */
.check-button {
  border: 2px solid var(--main03);
  border-radius: 10px;
  width: 300px;
  font-family: sans-serif;
  font-weight: bold;
  font-size: 11px;
  color: #8c8c8c;
  background-color: var(--main05);
  justify-content: center;
  cursor: pointer;
  padding: 10px;
}
.check-button-group {
  height: auto;
  display: flex;
  justify-content: center;
  width: 250px;
  overflow: hidden;
  margin: 34px;
  display: flex;
  gap: 0px;
}

.check-button:hover,
.check-button.active {
  color: var(--sub01) !important;
  border: 2px solid var(--sub01) !important;
  background-color: var(--sub02) !important;
}

/* GuideLink Section */
.guide-link {
  margin: 0px 34px 5px 34px;
  text-align: right;
  font-size: 15px;
  color: #8c8c8c;
  cursor: pointer;
}

/* MainSection-List styles */
.sub-section-list {
  margin-right: 60px;
  list-style-position: inside;
  padding: 2px 15px;
  font-size: 13px;
}
.list-section {
  margin: 0px 40px 34px 40px;
  border: 1px solid var(--main03);
  border-radius: 5px;
}

/* NextButton styles */
.complete-button {
  padding: 16px 0;
  background: var(--main01);
  color: var(--white);
  font-weight: 700;
  font-size: 20px;
  display: flex;
  justify-content: center;
  border: none;
  cursor: pointer;
}

/* Highlight styles */
.highlight-blue {
  color: var(--text-blue);
  font-weight: bold;
}
</style>

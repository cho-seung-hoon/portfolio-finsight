<!-- 
    작성자: JY
    작성일자: 2025-07-29
    페이지명: 투자성향분석-Step-1-페이지
    [경로]
        path: '/inv-type-test-step-1-page',
        name: 'InvTypeTestStep1Page',
        component: InvTypeTestStep1Page,
-->

<template>
  <<<<<<< HEAD
  <!-- Main Section start -->
  <!-- Q1 Section -->
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
        @click="selectProfessionalConsumer">
        전문금융소비자<br />(영업점가입대상)
      </button>
    </div>

    <!-- Question Guide Section -->
    <div
      class="guide-link"
      @click="goToNotion">
      전문금융소비자 안내 &gt;
    </div>

    <!-- Question Modal Section start-->
    <div
      v-if="isModalOpen"
      class="modal-overlay">
      <div class="modal-box">
        <h3>전문금융소비자 안내</h3>
        <br />
        <p>
          전문금융소비자에 해당하시는 고객님의 경우 영업점에 직접 방문하셔야만 가입이 가능합니다.
          <br /><br />
          ※ 따라서 본 서비스의 이용이 제한됩니다.
        </p>
        <br />
        <button
          class="modal-complete-button"
          @click="closeModal">
          확인하였습니다.
        </button>
      </div>
      <!-- Question Modal Section end-->
    </div>
  </div>

  <!-- Q2 Section -->
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

  <!-- Q3 Section -->
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
    <!-- Complete Button -->
    <button
      class="complete-button"
      :disabled="isNextDisabled"
      @click="goToNext">
      다음 단계로
    </button>
  </div>
  <!-- Main Section end-->
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const consumerType = ref(null);
const isVulnerable = ref(null);
const hasLoan = ref(null);

const goToNotion = () => {
  router.push('/inv-type-notice-page');
};
const goToNext = () => {
  router.push('/inv-type-test-step-2-page');
};

// modal func.
const isModalOpen = ref(false);
const selectProfessionalConsumer = () => {
  consumerType.value = '전문';
  isModalOpen.value = true;
};

// 전문금융 소비자 안내 화면 -- 이후 비활성화 기능
const isNextDisabled = ref(false);
const closeModal = () => {
  isModalOpen.value = false;
  isNextDisabled.value = true; // "다음 단계로" 버튼 비활성화
};
</script>

<style scoped>
/* Question Section Styles */
.question-box {
  margin-bottom: 10px;
  border: 1.5px solid var(--main04);
  border-radius: 5px;
  background-color: var(--main05);
}
.question-title {
  margin: 20px 40px;
  font-size: 15px;
}

/* Question - CheckBox Section Styles */
.check-button-group {
  display: flex;
  justify-content: center;
  gap: 0px;
  margin: 34px;
}
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
.check-button:hover,
.check-button.active {
  color: var(--sub01);
  border: 2px solid var(--sub01);
  background-color: var(--sub02);
}

/* Question - Guide Section Styles */
.guide-link {
  margin: 0px 34px 5px 34px;
  text-align: right;
  font-size: 15px;
  color: #8c8c8c;
  cursor: pointer;
}

/* Question - Modal Section Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.modal-box {
  background-color: white;

  padding: 24px;
  width: 90%;
  max-width: 320px;
  text-align: left;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.modal-complete-button {
  padding: 10px 10px;
  background: var(--main01);
  color: var(--white);
  font-weight: 700;
  font-size: 18px;
  display: flex;
  justify-content: center;
  border: none;
  cursor: pointer;
  width: calc(100%);
}

/* Question - List Section Styles */
.list-section {
  margin: 0px 40px 34px 40px;
  border: 1px solid var(--main03);
  border-radius: 5px;
}
.sub-section-list {
  margin-right: 60px;
  list-style-position: inside;
  padding: 2px 15px;
  font-size: 13px;
}

/* Button Styles */
.complete-button {
position: absolute;
bottom: 0;
left: 0;
width: 100%;
padding: 16px 0;
background: var(--main01);
color: var(--white);
font-weight: 700;
font-size: 20px;
border: none;
cursor: pointer;
z-index: 700; /* 다른 요소보다 위에 오도록 */
}
.complete-button:disabled {
background-color: #ccc;
cursor: not-allowed;
color: #666;
}

/* Highlight Styles*/
.highlight-blue {
  color: var(--text-blue);
  font-weight: bold;
}
</style>
======= >>>>>>> develop

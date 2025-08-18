<template>
  <div class="main-section">
    <!-- MainSection start-->
    <div class="notice-section">
      <p class="sub-section-list">
        고객님께서 적합한 상품을 선택 하시는데 도움을 드리기 위해 투자자정보를 제공하는 절차입니다.
      </p>
      <ul class="sub-section-list">
        <li>다음 질문에 대해 가장 적절하다고 생각되시는 답을 선택해 주세요. 총 7문항입니다.</li>
        <li>
          투자성향분석은 <span class="highlight-blue">대면, 비대면</span>을
          <span class="highlight-blue">통합</span>하여 <span class="highlight-red">1일 1회</span>만
          가능하니 신중하게 답해주세요.
        </li>
      </ul>
      <!-- MainSection end-->
    </div>

    <div class="question-section">
      <!-- QuestionSection (01) ~ (07) start -->
      <!-- 투자성향 페이지 출처: https://invest_test.isweb.co.kr/main_new -->

      <!-- QuestionSection (01) -->
      <section class="sub-section">
        <p class="question-title">
          <strong>Q1.</strong> 고객님의 <span class="highlight-blue">연령대</span>는 어떻게
          되시나요?
        </p>
        <div class="answer-list">
          <input
            type="radio"
            name="q1"
            :value="1"
            :id="'q1-1'"
            v-model="selectedAnswers.q1" />
          <label for="q1-1"> 19세 이하</label>

          <hr class="answer-boundary" />

          <input
            type="radio"
            name="q1"
            :value="2"
            :id="'q1-2'"
            v-model="selectedAnswers.q1" />
          <label for="q1-2"> 20세 ~ 40세</label>

          <hr class="answer-boundary" />

          <input
            type="radio"
            name="q1"
            :value="3"
            :id="'q1-3'"
            v-model="selectedAnswers.q1" />
          <label for="q1-3"> 41세 ~ 50세</label>
          <hr class="answer-boundary" />

          <input
            type="radio"
            name="q1"
            :value="4"
            :id="'q1-4'"
            v-model="selectedAnswers.q1" />
          <label for="q1-4"> 51세 ~ 60세</label>
          <hr class="answer-boundary" />

          <input
            type="radio"
            name="q1"
            :value="5"
            :id="'q1-5'"
            v-model="selectedAnswers.q1" />
          <label for="q1-5"> 61세 이상</label>
        </div>
      </section>

      <!-- QuestionSection (02) -->
      <section class="sub-section">
        <p class="question-title">
          <strong>Q2.</strong> 고객님의 투자하고자 하는 자금의
          <span class="highlight-blue">투자 가능 기간</span>은 어떻게 되시나요?
        </p>
        <div class="answer-list">
          <input
            type="radio"
            name="q2"
            :value="1"
            :id="'q2-1'"
            v-model="selectedAnswers.q2" />
          <label for="q2-1"> 6개월 이내</label>

          <hr class="answer-boundary" />

          <input
            type="radio"
            name="q2"
            :value="2"
            :id="'q2-2'"
            v-model="selectedAnswers.q2" />
          <label for="q2-2"> 6개월 이상 ~ 1년 이내</label>

          <hr class="answer-boundary" />

          <input
            type="radio"
            name="q2"
            :value="3"
            :id="'q2-3'"
            v-model="selectedAnswers.q2" />
          <label for="q2-3"> 1년 이상 ~ 2년 이내</label>

          <hr class="answer-boundary" />

          <input
            type="radio"
            name="q2"
            :value="4"
            :id="'q2-4'"
            v-model="selectedAnswers.q2" />
          <label for="q2-4"> 2년 이상 ~ 3년 이내</label>

          <hr class="answer-boundary" />

          <input
            type="radio"
            name="q2"
            :value="5"
            :id="'q2-5'"
            v-model="selectedAnswers.q2" />
          <label for="q2-5"> 3년 이상</label>
        </div>
      </section>

      <!-- QuestionSection (03) -->
      <section class="sub-section">
        <p class="question-title">
          <strong>Q3.</strong> 다음 중 고객님의 <span class="highlight-blue">투자경험</span>과 가장
          가까운 것을 선택해주세요.
          <span class="highlight-red">(중복 가능)</span>
        </p>
        <div class="answer-list">
          <input
            type="checkbox"
            name="q3"
            :value="1"
            :id="'q3-1'"
            v-model="selectedAnswers.q3" />
          <label for="q3-1"> 은행의 예/적금, 국채, 지방채, 보증채, MMF, CMA 등</label>

          <hr class="answer-boundary" />

          <input
            type="checkbox"
            name="q3"
            :value="2"
            :id="'q3-2'"
            v-model="selectedAnswers.q3" />
          <label for="q3-2"> 금융채, 신용도가 높은 회사채, 채권형펀드 ,원금보존추구형ELS 등</label>

          <hr class="answer-boundary" />

          <input
            type="checkbox"
            name="q3"
            :value="3"
            :id="'q3-3'"
            v-model="selectedAnswers.q3" />
          <label for="q3-3">
            신용도 중간 등급의 회사채, 원금의 일부만 보장되는 ELS, 혼합형 펀드 등</label
          >

          <hr class="answer-boundary" />

          <input
            type="checkbox"
            name="q3"
            :value="4"
            :id="'q3-4'"
            v-model="selectedAnswers.q3" />
          <label for="q3-4">
            신용도가 낮은 회사채, 주식, 원금이 보장되지 않는 ELS, 시장수익률 수준의 수익을 추구하는
            주식형 펀드 등</label
          >

          <hr class="answer-boundary" />

          <input
            type="checkbox"
            name="q3"
            :value="5"
            :id="'q3-5'"
            v-model="selectedAnswers.q3" />
          <label for="q3-5">
            ELW, 선물옵션, 시장수익률 이상의 수익을 추구하는 주식형펀드 ,파생상품에 투자하는 펀드,
            주식 신용거래 등</label
          >
        </div>
      </section>

      <!-- QuestionSection (02) -->
      <section class="sub-section">
        <p class="question-title">
          <strong>Q4.</strong> 금융상품 투자에 대한 고객님의
          <span class="highlight-blue">지식수준</span>은 어느 정도라고 생각하시나요?
        </p>
        <div class="answer-list">
          <input
            type="radio"
            name="q4"
            :value="1"
            :id="'q4-1'"
            v-model="selectedAnswers.q4" />
          <label for="q4-1">
            [ 매우 낮은 수준 ] 투자의사 결정을 스스로 내려본 경험이 없는 정도</label
          >

          <hr class="answer-boundary" />

          <input
            type="radio"
            name="q4"
            :value="2"
            :id="'q4-2'"
            v-model="selectedAnswers.q4" />
          <label for="q4-2"> [ 낮은 수준 ] 주식과 채권의 차이를 구별할 수 있는 정도</label>

          <hr class="answer-boundary" />

          <input
            type="radio"
            name="q4"
            :value="3"
            :id="'q4-3'"
            v-model="selectedAnswers.q4" />
          <label for="q4-3">
            [ 높은 수준 ] 투자할 수 있는 대부분의 금융상품의 차이를 구별할 수 있는 정도</label
          >

          <hr class="answer-boundary" />

          <input
            type="radio"
            name="q4"
            :value="4"
            :id="'q4-4'"
            v-model="selectedAnswers.q4" />
          <label for="q4-4">
            [ 매우 높은 수준 ] 금융상품을 비롯하여 모든 투자대상 상품의 차이를 이해할 수 있는
            정도</label
          >
        </div>
      </section>

      <!-- QuestionSection (03) -->
      <section class="sub-section">
        <p class="question-title">
          <strong>Q5.</strong> 고객님께서 현재
          <span class="highlight-blue">투자하고자 하는 자금</span>은 전체 금융자산(부동산 등을 제외)
          중 <span class="highlight-blue">어느 정도의 비중</span>을 차지하나요?
        </p>
        <div class="answer-list">
          <input
            type="radio"
            name="q5"
            :value="1"
            :id="'q5-1'"
            v-model="selectedAnswers.q5" />
          <label for="q5-1"> 10% 이내</label>

          <hr class="answer-boundary" />

          <input
            type="radio"
            name="q5"
            :value="2"
            :id="'q5-2'"
            v-model="selectedAnswers.q5" />
          <label for="q5-2"> 10% 이상 ~ 20% 이내</label>

          <hr class="answer-boundary" />

          <input
            type="radio"
            name="q5"
            :value="3"
            :id="'q5-3'"
            v-model="selectedAnswers.q5" />
          <label for="q5-3"> 20% 이상 ~ 30% 이내</label>

          <hr class="answer-boundary" />

          <input
            type="radio"
            name="q5"
            :value="4"
            :id="'q5-4'"
            v-model="selectedAnswers.q5" />
          <label for="q5-4"> 30% 이상 ~ 40% 이내</label>

          <hr class="answer-boundary" />

          <input
            type="radio"
            name="q5"
            :value="5"
            :id="'q5-5'"
            v-model="selectedAnswers.q5" />
          <label for="q5-5"> 40% 이상</label>
        </div>
      </section>

      <!-- QuestionSection (04) -->
      <section class="sub-section">
        <p class="question-title">
          <strong>Q6.</strong> 다음 중 고객님의 <span class="highlight-blue">수입원</span>을 가장 잘
          나타내고 있는 것은 어느 것인가요?
        </p>
        <div class="answer-list">
          <input
            type="radio"
            name="q6"
            :value="1"
            :id="'q6-1'"
            v-model="selectedAnswers.q6" />
          <label for="q6-1">
            현재 일정한 수입이 발생하고 있으며, 향후 현재 수준을 유지하거나 증가할 것으로
            예상된다.</label
          >

          <hr class="answer-boundary" />

          <input
            type="radio"
            name="q6"
            :value="2"
            :id="'q6-2'"
            v-model="selectedAnswers.q6" />
          <label for="q6-2">
            현재 일정한 수입이 발생하고 있으나, 향후 감소하거나 불안정할 것으로 예상된다.</label
          >

          <hr class="answer-boundary" />

          <input
            type="radio"
            name="q6"
            :value="3"
            :id="'q6-3'"
            v-model="selectedAnswers.q6" />
          <label for="q6-3"> 현재 일정한 수입이 없으며, 연금이 주수입원이다.</label>
        </div>
      </section>

      <!-- QuestionSection (05) -->
      <section class="sub-section">
        <p class="question-title">
          <strong>Q7.</strong> 만약 투자원금에 <span class="highlight-red">손실</span>이 발생할
          경우, 다음 중
          <span class="highlight-blue">감수할 수 있는 손실 수준</span>
          은 어느 것 인가요?
        </p>
        <div class="answer-list">
          <input
            type="radio"
            name="q7"
            :value="1"
            :id="'q7-1'"
            v-model="selectedAnswers.q7" />
          <label for="q7-1"> 무슨 일이 있어도 투자원금은 보전되어야 한다.</label>

          <hr class="answer-boundary" />

          <input
            type="radio"
            name="q7"
            :value="2"
            :id="'q7-2'"
            v-model="selectedAnswers.q7" />
          <label for="q7-2"> 10% 미만까지는 손실을 감수할 수 있을 것 같다.</label>

          <hr class="answer-boundary" />

          <input
            type="radio"
            name="q7"
            :value="3"
            :id="'q7-3'"
            v-model="selectedAnswers.q7" />
          <label for="q7-3"> 20% 미만까지는 손실을 감수할 수 있을 것 같다.</label>

          <hr class="answer-boundary" />

          <input
            type="radio"
            name="q7"
            :value="4"
            :id="'q7-4'"
            v-model="selectedAnswers.q7" />
          <label for="q7-4"> 기대수익이 높다면 위험이 높아도 상관하지 않겠다.</label>
        </div>
      </section>
      <!-- QuestionSection (1) ~ (7) end -->
    </div>
    <!-- NoticeSection start -->
    <div class="last-section">
      <h3 class="sub-title">
        <img
          class="notice_img"
          src="/src/assets/styles/img/notice.png"
          alt="경고" />
        알려드립니다
      </h3>
      <div class="bottom-wrapper">
        <p class="highlight-blue">
          본인은 투자목적, 재산상황 및 투자경험 등의 정보를 정확히 등록하였으며 다음과 같은 사항을
          확인합니다.
        </p>
        <ul class="sub-section-list">
          <li>투자성향분석결과에 따라 적합한 상품만 가입 가능해요!</li>
          <li>
            투자경험, 투자목적, 투자기간 및 손실 감내 수준과 관련한 설문항목 답변에 따라 ELS/ELF 등
            일부 상품의 가입이 제한될 수 있어요!
          </li>
        </ul>
      </div>
      <br /><br />
      <!-- NoticeSection end -->

      <!-- Complete Button start -->
      <button
        class="complete-button"
        @click="goToNext">
        나의 투자성향 분석결과
      </button>
      <!-- Complete Button end -->
    </div>
  </div>

  <BaseModal
    :visible="isModalOpen"
    :onClose="closeModal"
    class="align-left">
    <template #title> 투자성향분석 결과 안내 </template>
    <template #default>
      고객님의 투자성향과 가입하고자 하는 금융투자상품의 위험 수준을 확인 후<br />
      신중하게 투자하여 주시기 바랍니다.
    </template>
  </BaseModal>

  <BaseModal
    :visible="isAlertModalOpen"
    :onClose="() => (isAlertModalOpen = false)">
    <template #title> 안내 </template>
    <template #default> 모든 질문에 응답해 주세요. </template>
  </BaseModal>
</template>

<style scoped>
/* Main Section Styles */
.main-section {
  background: var(--off-white);
  min-height: calc(100dvh - 56px);
  display: flex;
  flex-direction: column;
  position: relative;
}
.notice-section {
  margin: 20px 0;
}
.question-section {
  background-color: var(--main04);
  margin-left: -20px;
  margin-right: -20px;
  padding: 20px;
}
.last-section {
  padding-top: 30px;
}

.sub-section-list {
  list-style-position: inside;
  padding: 5px 10px;
  margin: 5px;
  font-size: var(--font-size-md);
}

/* Question Section Styles */
.sub-section {
  padding: 20px;
  margin-bottom: 20px;
  border: 1.5px solid var(--main04);
  border-radius: 5px;
  background-color: var(--main05);
  height: auto;
  width: calc(100%);
}

.question-title {
  margin-bottom: 10px;
  font-size: var(--font-size-md);
}

.answer-list {
  margin-top: 20px;
  font-size: var(--font-size-ms);
}

.answer-boundary {
  border: 1px solid var(--main04);
  margin: 10px 5px 10px 5px;
}

/* Notice Section Styles */
.sub-title {
  display: flex;
  justify-items: center;
  margin-bottom: 15px;
  gap: 10px;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
}

.notice_img {
  width: 20px;
  height: auto;
}

/* Button Section Styles */
.complete-button {
  width: 100%;
  padding: 16px 0;
  background: var(--main01);
  color: var(--white);
  font-weight: var(--font-weight-semi-bold);
  font-size: 20px;
  border: none;
  cursor: pointer;
  margin-top: auto;
  margin-bottom: 60px;
  border-radius: 8px;
}

/* Modal Section Styles */
.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
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

/* Highlight styles */
.highlight-blue {
  color: var(--text-blue);
  font-weight: var(--font-weight-bold);
}

.highlight-red {
  color: var(--text-red);
  font-weight: bold;
}
</style>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import BaseModal from '@/components/common/BaseModal.vue';
import axios from 'axios';
import { useSessionStore } from '@/stores/session';

const router = useRouter();
const sessionStore = useSessionStore();

// API 함수들 - 컴포넌트 내부에 정의
const insertInvestmentProfileApi = (investmentProfileType) => {
  const accessToken = sessionStore.accessToken;
  return axios.put('http://localhost:8080/users/invt',
  // return axios.put('/users/invt', 
    { investmentProfileType },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
};

const updateInvestmentProfileApi = (investmentProfileType) => {
  const accessToken = sessionStore.accessToken;
  // return axios.put('/users/invt/update', 
  return axios.put('http://localhost:8080/users/invt',
    { investmentProfileType },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
};


const scoreTable = {
  q1: { 1: 12.5, 2: 12.5, 3: 9.3, 4: 6.2, 5: 3.1 },
  q2: { 1: 3.1, 2: 6.2, 3: 9.3, 4: 12.5, 5: 15.6 },
  q3: { 1: 3.1, 2: 6.2, 3: 9.3, 4: 12.5, 5: 15.6 },
  q4: { 1: 3.1, 2: 6.2, 3: 9.3, 4: 12.5 },
  q5: { 1: 15.6, 2: 12.5, 3: 9.3, 4: 6.2, 5: 3.1 },
  q6: { 1: 9.3, 2: 6.2, 3: 3.1 },
  q7: { 1: -6.2, 2: 6.2, 3: 12.5, 4: 18.7 }
};

const selectedAnswers = reactive({
  q1: null,
  q2: null,
  q3: [],
  q4: null,
  q5: null,
  q6: null,
  q7: null
});

const totalScore = computed(() => {
  let score = 0;
  for (const [key, val] of Object.entries(selectedAnswers)) {
    if (key === 'q3') {
      val.forEach(v => (score += scoreTable.q3[v] || 0));
    } else {
      score += scoreTable[key]?.[val] || 0;
    }
  }
  return score;
});

const getInvestmentProfileType = score => {
  // if (score <= 20) return 'stable';
  // if (score <= 40) return 'stableplus';
  // if (score <= 60) return 'neutral';
  // if (score <= 80) return 'aggressive';
  // return 'veryaggressive';
  if (score <= 20) return 'STABLE';
  if (score <= 40) return 'STABLEPLUS';
  if (score <= 60) return 'NEUTRAL';
  if (score <= 80) return 'AGGRESSIVE';
  return 'VERYAGGRESSIVE';
};

const isAlertModalOpen = ref(false);
const isModalOpen = ref(false);

const isAllAnswered = computed(() => {
  return (
    selectedAnswers.q1 !== null &&
    selectedAnswers.q2 !== null &&
    selectedAnswers.q3.length > 0 &&
    selectedAnswers.q4 !== null &&
    selectedAnswers.q5 !== null &&
    selectedAnswers.q6 !== null &&
    selectedAnswers.q7 !== null
  );
});

const investmentProfileType = ref('');

// 최초 저장 API ("/users/invt")
const submitInvestmentProfile = async () => {
  if (!investmentProfileType.value) {
    console.error('투자성향 타입이 없습니다.');
    return;
  }
  try {
    const response = await insertInvestmentProfileApi(investmentProfileType.value);
    console.log('투자성향 저장 성공:', response.data);
  } catch (error) {
    console.error('투자성향 저장 실패:', error);
  }
};


// 수정 API ("/api/users/invt/update")
const updateInvestmentProfile = async () => {
  if (!investmentProfileType.value) {
    console.error('투자성향 타입이 없습니다.');
    return;
  }
  try {
    const response = await updateInvestmentProfileApi(investmentProfileType.value);
    console.log('투자성향 수정 성공:', response.data);
  } catch (error) {
    console.error('투자성향 수정 실패:', error);
  }
};


// submit 버튼 클릭 시 최초 저장 혹은 수정 API 호출 로직
const isExistingProfile = ref(false);

const goToNext = async () => {
  if (!isAllAnswered.value) {
    isAlertModalOpen.value = true;
    return;
  }
  investmentProfileType.value = getInvestmentProfileType(totalScore.value);

  if (isExistingProfile.value) {
    await updateInvestmentProfile();
  } else {
    await submitInvestmentProfile();
  }

  isModalOpen.value = true;
};

const closeModal = () => {
  router.push({
    path: '/inv-type-results-page',
    query: {
      score: totalScore.value,
      investmentProfileType: investmentProfileType.value
    }
  });
};

watch(totalScore, newScore => {
  console.log('현재 총 점수:', newScore.toFixed(2));
  console.log('현재 투자 성향:', getInvestmentProfileType(newScore));
});
</script>

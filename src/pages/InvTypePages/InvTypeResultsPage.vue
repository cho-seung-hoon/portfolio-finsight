<!-- 
  작성자: JY
  작성일자: 2025-07-29
  페이지명: 투자성향분석-결과-페이지
      [경로]
      path: '/inv-type-results-page',
      name: 'InvTypeResultsPage',
      component: InvTypeResultsPage,
-->

<template>
  <div class="main-section">
    <!-- Notice Section start -->
    <div class="notice-wrapper">
      <img
        src="/src/assets/styles/img/notice.png"
        alt="notice"
        class="notice-img" />
      <span>
        본 상품은 일반 예금상품과 달리 원금의 일부 또는 전부 손실이 발생할 수 있으며, 투자로 인한
        손실은 투자자 본인에게 귀속됩니다.</span
      >
    </div>
    <!-- Notice Section end -->

    <div class="sub-wrapper">

    <!-- Main Section start -->
    <section class="sub-section">
      <div class="result-section">
        <!-- Text Section start -->
        <h2 class="results-title">나의 투자성향은?</h2>
        <br />
        <div class="result-wrapper">
          <p class="result-text">
            <span
              class="result-text"
              :class="`highlight-${userType}`"
              >{{ invest_type }}</span
            >으로,
          </p>
          <p class="result-text">
            <span
              class="result-text"
              :class="`highlight-${userType}`"
              >{{ invest_type_description }}</span
            >에
          </p>
          <p>가입할 수 있습니다.</p>
        </div>
        <br /><br />
        <!-- Text Section end -->

        <!-- Graph Section start -->
        <div class="graph-wrapper">
          <img
            v-if="userType === 'stable'"
            src="/src/assets/styles/img/stableChart.PNG"
            alt="stableChart"
            class="graph-image" />
          <img
            v-if="userType === 'stableplus'"
            src="/src/assets/styles/img/stableplusChart.PNG"
            alt="stableplusChart"
            class="graph-image" />
          <img
            v-if="userType === 'neutral'"
            src="/src/assets/styles/img/neutralChart.PNG"
            alt="neutralChart"
            class="graph-image" />
          <img
            v-if="userType === 'aggressive'"
            src="/src/assets/styles/img/aggressiveChart.PNG"
            alt="aggressiveChart"
            class="graph-image" />
          <img
            v-else-if="userType === 'veryaggressive'"
            src="/src/assets/styles/img/veryaggressiveChart.PNG"
            alt="veryaggressiveChart"
            class="graph-image" />
        </div>
        <!-- Graph Section end -->
      </div>
    </section>
    <!-- Main Section end -->

    <!-- Portfolio Section start -->
    <p class="portfolio-wrapper">
      <button
        class="portfolio-button"
        @click="goToPortfolio">
        적합상품 등급 안내
      </button>
    </p>
    <br />
    <!-- Portfolio Section end -->

    <!-- Complete Button start -->
    <button
      class="complete-button"
      @click="goToMain">
      확인
    </button>
    <!-- Complete Button end -->
  </div>
  </div>

</template>

<style scoped>
.main-section{
  background: var(--off-white);
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: calc(100dvh - 56px);
}

/* Notice Section Styles */
.notice-wrapper {
  margin:20px 0;
  font-size:var(--font-size-md);
  display:flex;
  gap:5px;
}

.sub-wrapper{
  background-color:var(--white);
  margin-left: -20px;
  margin-right: -20px;
  padding: 0 20px;
  flex:1;
  display: flex;
  flex-direction: column;
}

.notice-img {
  margin: 1px 3px auto;
  width: 18px;
  height: auto;
}

/* Main Section Styles */
.sub-section {
  margin:30px 0;
  border-radius: 8px;
  background-color: var(--white);
  height: auto;
}

.result-section{
  display: flex;
  flex-direction: column;
  /* align-items: center;  <-- 이 줄 삭제 */

  /* 아래 2줄 추가 */
  width: 350px; /* 이미지 너비와 동일하게 설정 */
  margin: 0 auto; /* 이 컨테이너 자체를 가운데 정렬 */
}

/* Main - Text Section Styles */
.results-title {
  text-align: left;
  font-size:var(--font-size-xxl);
}

.result-wrapper {
  text-align: left;
}

.result-text {
}

/* Main - Graph Section Styles */
.graph-wrapper {
  padding-bottom: 15px;
}

.graph-image {
  display: block;
  /* margin: 0 auto; <-- 이 줄 삭제 */
  width: 350px;
  height: auto;
}

.portfolio-wrapper {
  width: 340px;
  margin: 0 auto;
}


.portfolio-button {
  padding: 16px 16px;
  background: var(--white);
  border:1px solid var(--main01);
  color: var(--main01);
  border-radius: 5px;
  cursor: pointer;
  width:100%;
}



.complete-button {
  width: 100%;
  padding: 16px 0;
  background: var(--main01);
  color: var(--white);
  font-weight: var(--font-weight-semi-bold);
  font-size: var(--font-size-md);
  border-radius: 8px;
  cursor: pointer;
  margin-top: auto;
  margin-bottom:60px;
}

/* Highlight styles */
.highlight-blue {
  color: var(--text-blue);
  font-weight: bold;
}

.highlight-red {
  color: var(--text-red);
  font-weight: bold;
}

.highlight-stable {
  color: var(--mint01);
  font-weight: bold;
}

.highlight-stableplus {
  color: var(--green01);
  font-weight: bold;
}

.highlight-neutral {
  color: var(--yellow01);
  font-weight: bold;
}

.highlight-aggressive {
  color: var(--orange01);
  font-weight: bold;
}

.highlight-veryaggressive {
  color: var(--red01);
  font-weight: bold;
}
</style>

<script setup>
// imports
import { useRouter, useRoute } from 'vue-router';
import { ref, watch } from 'vue';

// 경로 기능
const router = useRouter();
const goToPortfolio = () => {
  router.push({ path: '/portfolio-page', query: { userType: userType.value } });
};
const goToMain = () => {
  router.push('/');
};

// 투자유형 정리
const userType = ref('');
const invest_type = ref('');
const invest_type_description = ref('');
const route = useRoute();

// 투자유형 판단 함수
const getType = score => {
  if (score <= 20) return 'stable'; // 안정형
  if (score <= 40) return 'stableplus'; // 안정추구형
  if (score <= 60) return 'neutral'; // 위험중립형
  if (score <= 80) return 'aggressive'; // 적극투자형
  return 'veryaggressive'; // 공격투자형
};

// 유형별 한글 이름과 설명을 매핑하는 함수
const getTypeDetails = type => {
  switch (type) {
    case 'stable':
      return { name: '안정형', description: '원금 손실 가능성이 낮은 상품(6등급)' };
    case 'stableplus':
      return { name: '안정추구형', description: '낮은 위험, 낮은 수익 추구 상품(5등급)' }; // 예시
    case 'neutral':
      return { name: '위험중립형', description: '적절한 위험, 적절한 수익 추구 상품(4등급)' }; // 예시
    case 'aggressive':
      return { name: '적극투자형', description: '높은 위험, 높은 수익 추구 상품(3등급)' }; // 예시
    case 'veryaggressive':
      return {
        name: '공격투자형',
        description: '매우 높은 위험, 매우 높은 수익 추구 상품(1-2등급)'
      }; // 예시
    default:
      return { name: '알 수 없음', description: '정보 부족' };
  }
};

// 컴포넌트가 마운트될 때 라우트 쿼리에서 값을 가져옵니다.
// 또는 watch를 사용하여 쿼리 파라미터 변경을 감지할 수 있습니다.
watch(
  () => route.query,
  newQuery => {
    const score = parseFloat(newQuery.score);
    const typeFromQuery = newQuery.type;

    if (typeFromQuery) {
      userType.value = typeFromQuery;
    } else if (!isNaN(score)) {
      userType.value = getType(score);
    } else {
      userType.value = 'stable';
    }
    const details = getTypeDetails(userType.value);
    invest_type.value = details.name;
    invest_type_description.value = details.description;
  },
  {
    immediate: true
  }
);
</script>

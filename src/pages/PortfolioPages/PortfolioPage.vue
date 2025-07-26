<!-- 
작성자: JY
작성일자: 2025-07-25
페이지명: 포트폴리오-페이지
    [경로]
    path: '/portfolio-page',
    name: 'PortfolioPage',
    component: PortfolioPage
-->

<template>
  <!-- TitleSection start-->
  <div class="main-section title-button-wrapper">
    <h1 class="main-title">나의 포트폴리오</h1>
    <button
      class="close-button"
      @click="goToMain">
      X
    </button>
  </div>
  <br />
  <!-- TitleSection end-->

  <!-- ResultMainSection start -->
  <section class="sub-title">
    <div class="result-section">
      <h2>
        <span
          v-if="userType === 'stable'"
          class="highlight-stable"
          >안정형</span
        >
        <span
          v-if="userType === 'stableplus'"
          class="highlight-stableplus"
          >안정추구형</span
        >
        <span
          v-if="userType === 'neutral'"
          class="highlight-neutral"
          >위험중립형</span
        >
        <span
          v-if="userType === 'aggressive'"
          class="highlight-aggressive"
          >적극투자형</span
        >
        <span
          v-if="userType === 'veryaggressive'"
          class="highlight-veryaggressive"
          >공격투자형</span
        >

        <span class="highlight-white">을 위한 포트폴리오</span>
      </h2>
    </div>
  </section>
  <!-- ResultMainSection end -->

  <!-- GrapthSection start -->
  <section class="sub-section">
    <div class="result-section">
      <h2>{{ name }}님의 투자유형은?</h2>
      <br />
      <!-- 투자유형에 따라 그래프 보기 -->
      <img
        v-if="userType === 'stable'"
        src="/src/assets/styles/img/stableChart.PNG"
        alt="stableChart"
        class="chart-image" />
      <img
        v-if="userType === 'stableplus'"
        src="/src/assets/styles/img/stableplusChart.PNG"
        alt="stableplusChart"
        class="chart-image" />
      <img
        v-if="userType === 'neutral'"
        src="/src/assets/styles/img/neutralChart.PNG"
        alt="neutralChart"
        class="chart-image" />
      <img
        v-if="userType === 'aggressive'"
        src="/src/assets/styles/img/aggressiveChart.PNG"
        alt="aggressiveChart"
        class="chart-image" />
      <img
        v-else-if="userType === 'veryaggressive'"
        src="/src/assets/styles/img/veryaggressiveChart.PNG"
        alt="veryaggressiveChart"
        class="chart-image" />
    </div>
  </section>
  <!-- GrapthSection end -->

  <section class="sub-section">
    <div class="result-section">
      <h2>Fin-sight 추천 자산비중</h2>
      <br />
      <!-- TableSection start -->
      <table
        v-if="userType === 'stable'"
        class="table-main-style">
        <thead>
          <tr>
            <th
              class="table-style"
              colspan="2">
              상품별 종목
            </th>
            <th class="table-style">위험등급</th>
            <th class="table-highlight-stable">안정형</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              class="table-style"
              rowspan="5">
              국내상품
            </td>
            <td class="table-style">국내 주식형 펀드/ETF</td>
            <td class="table-style">2등급</td>
            <td class="table-highlight-stable"></td>
          </tr>
          <tr>
            <td class="table-style">국내 채권 혼합형 펀드/ETF</td>
            <td class="table-style">5등급</td>
            <td class="table-highlight-stable"></td>
          </tr>
          <tr>
            <td class="table-style">국내 채권형 펀드/ETF</td>
            <td class="table-style">5등급</td>
            <td class="table-highlight-stable">98%</td>
          </tr>
          <tr>
            <td class="table-style">국내 채권형 펀드/ETF</td>
            <td class="table-style">6등급</td>
            <td class="table-highlight-stable">98%</td>
          </tr>
          <tr>
            <td class="table-style">현금성(예금 등)</td>
            <td class="table-style">6등급</td>
            <td class="table-highlight-stable">2%</td>
          </tr>
          <tr>
            <td
              class="table-style"
              rowspan="4">
              국내상품
            </td>
            <td class="table-style">해외 주식형 펀드/ETF</td>
            <td class="table-style">1등급</td>
            <td class="table-highlight-stable"></td>
          </tr>
          <tr>
            <td class="table-style">해외 주식형 펀드/ETF</td>
            <td class="table-style">2등급</td>
            <td class="table-highlight-stable"></td>
          </tr>
          <tr>
            <td class="table-style">해외 주식형 펀드/ETF</td>
            <td class="table-style">3등급</td>
            <td class="table-highlight-stable"></td>
          </tr>
          <tr>
            <td class="table-style">해외 채권형 펀드/ETF</td>
            <td class="table-style">4등급</td>
            <td class="table-highlight-stable"></td>
          </tr>
          <tr>
            <td
              class="table-style"
              colspan="3">
              위험자산 <small class="notice">**</small> 비중
            </td>
            <td class="table-highlight-stable">0%</td>
          </tr>
          <tr>
            <td
              class="table-style"
              colspan="3">
              모델 포트폴리오 위험도
            </td>
            <td class="table-highlight-stable">6.00</td>
          </tr>
        </tbody>
      </table>
      <table
        v-if="userType === 'stableplus'"
        class="table-main-style">
        <thead>
          <tr>
            <th
              class="table-style"
              colspan="2">
              상품별 종목
            </th>
            <th class="table-style">위험등급</th>
            <th class="table-highlight-stableplus">안정추구형</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              class="table-style"
              rowspan="5">
              국내상품
            </td>
            <td class="table-style">국내 주식형 펀드/ETF</td>
            <td class="table-style">2등급</td>
            <td class="table-highlight-stableplus">7%</td>
          </tr>
          <tr>
            <td class="table-style">국내 채권 혼합형 펀드/ETF</td>
            <td class="table-style">5등급</td>
            <td class="table-highlight-stableplus">12%</td>
          </tr>
          <tr>
            <td class="table-style">국내 채권형 펀드/ETF</td>
            <td class="table-style">5등급</td>
            <td class="table-highlight-stableplus">5%</td>
          </tr>
          <tr>
            <td class="table-style">국내 채권형 펀드/ETF</td>
            <td class="table-style">6등급</td>
            <td class="table-highlight-stableplus">59%</td>
          </tr>
          <tr>
            <td class="table-style">현금성(예금 등)</td>
            <td class="table-style">6등급</td>
            <td class="table-highlight-stableplus">2%</td>
          </tr>
          <tr>
            <td
              class="table-style"
              rowspan="4">
              국내상품
            </td>
            <td class="table-style">해외 주식형 펀드/ETF</td>
            <td class="table-style">1등급</td>
            <td class="table-highlight-stableplus"></td>
          </tr>
          <tr>
            <td class="table-style">해외 주식형 펀드/ETF</td>
            <td class="table-style">2등급</td>
            <td class="table-highlight-stableplus">10%</td>
          </tr>
          <tr>
            <td class="table-style">해외 주식형 펀드/ETF</td>
            <td class="table-style">3등급</td>
            <td class="table-highlight-stableplus">5%</td>
          </tr>
          <tr>
            <td class="table-style">해외 채권형 펀드/ETF</td>
            <td class="table-style">4등급</td>
            <td class="table-highlight-stableplus"></td>
          </tr>
          <tr>
            <td
              class="table-style"
              colspan="3">
              위험자산 <small class="notice">**</small> 비중
            </td>
            <td class="table-highlight-stableplus">22%</td>
          </tr>
          <tr>
            <td
              class="table-style"
              colspan="3">
              모델 포트폴리오 위험도
            </td>
            <td class="table-highlight-stableplus">5.00</td>
          </tr>
        </tbody>
      </table>
      <table
        v-if="userType === 'neutral'"
        class="table-main-style">
        <thead>
          <tr>
            <th
              class="table-style"
              colspan="2">
              상품별 종목
            </th>
            <th class="table-style">위험등급</th>
            <th class="table-highlight-neutral">위험중립형</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              class="table-style"
              rowspan="5">
              국내상품
            </td>
            <td class="table-style">국내 주식형 펀드/ETF</td>
            <td class="table-style">2등급</td>
            <td class="table-highlight-neutral">8%</td>
          </tr>
          <tr>
            <td class="table-style">국내 채권 혼합형 펀드/ETF</td>
            <td class="table-style">5등급</td>
            <td class="table-highlight-neutral">10%</td>
          </tr>
          <tr>
            <td class="table-style">국내 채권형 펀드/ETF</td>
            <td class="table-style">5등급</td>
            <td class="table-highlight-neutral">6%</td>
          </tr>
          <tr>
            <td class="table-style">국내 채권형 펀드/ETF</td>
            <td class="table-style">6등급</td>
            <td class="table-highlight-neutral">34%</td>
          </tr>
          <tr>
            <td class="table-style">현금성(예금 등)</td>
            <td class="table-style">6등급</td>
            <td class="table-highlight-neutral">2%</td>
          </tr>
          <tr>
            <td
              class="table-style"
              rowspan="4">
              국내상품
            </td>
            <td class="table-style">해외 주식형 펀드/ETF</td>
            <td class="table-style">1등급</td>
            <td class="table-highlight-neutral"></td>
          </tr>
          <tr>
            <td class="table-style">해외 주식형 펀드/ETF</td>
            <td class="table-style">2등급</td>
            <td class="table-highlight-neutral">28%</td>
          </tr>
          <tr>
            <td class="table-style">해외 주식형 펀드/ETF</td>
            <td class="table-style">3등급</td>
            <td class="table-highlight-neutral">12%</td>
          </tr>
          <tr>
            <td class="table-style">해외 채권형 펀드/ETF</td>
            <td class="table-style">4등급</td>
            <td class="table-highlight-neutral"></td>
          </tr>
          <tr>
            <td
              class="table-style"
              colspan="3">
              위험자산 <small class="notice">**</small> 비중
            </td>
            <td class="table-highlight-neutral">48%</td>
          </tr>
          <tr>
            <td
              class="table-style"
              colspan="3">
              모델 포트폴리오 위험도
            </td>
            <td class="table-highlight-neutral">4.04</td>
          </tr>
        </tbody>
      </table>
      <table
        v-if="userType === 'aggressive'"
        class="table-main-style">
        <thead>
          <tr>
            <th
              class="table-style"
              colspan="2">
              상품별 종목
            </th>
            <th class="table-style">위험등급</th>
            <th class="table-highlight-aggressive">적극투자형</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              class="table-style"
              rowspan="5">
              국내상품
            </td>
            <td class="table-style">국내 주식형 펀드/ETF</td>
            <td class="table-style">2등급</td>
            <td class="table-highlight-aggressive">10%</td>
          </tr>
          <tr>
            <td class="table-style">국내 채권 혼합형 펀드/ETF</td>
            <td class="table-style">5등급</td>
            <td class="table-highlight-aggressive"></td>
          </tr>
          <tr>
            <td class="table-style">국내 채권형 펀드/ETF</td>
            <td class="table-style">5등급</td>
            <td class="table-highlight-aggressive">10%</td>
          </tr>
          <tr>
            <td class="table-style">국내 채권형 펀드/ETF</td>
            <td class="table-style">6등급</td>
            <td class="table-highlight-aggressive">23%</td>
          </tr>
          <tr>
            <td class="table-style">현금성(예금 등)</td>
            <td class="table-style">6등급</td>
            <td class="table-highlight-aggressive">2%</td>
          </tr>
          <tr>
            <td
              class="table-style"
              rowspan="4">
              국내상품
            </td>
            <td class="table-style">해외 주식형 펀드/ETF</td>
            <td class="table-style">1등급</td>
            <td class="table-highlight-aggressive">4%</td>
          </tr>
          <tr>
            <td class="table-style">해외 주식형 펀드/ETF</td>
            <td class="table-style">2등급</td>
            <td class="table-highlight-aggressive">32%</td>
          </tr>
          <tr>
            <td class="table-style">해외 주식형 펀드/ETF</td>
            <td class="table-style">3등급</td>
            <td class="table-highlight-aggressive">14%</td>
          </tr>
          <tr>
            <td class="table-style">해외 채권형 펀드/ETF</td>
            <td class="table-style">4등급</td>
            <td class="table-highlight-aggressive">5%</td>
          </tr>
          <tr>
            <td
              class="table-style"
              colspan="3">
              위험자산 <small class="notice">**</small> 비중
            </td>
            <td class="table-highlight-aggressive">60%</td>
          </tr>
          <tr>
            <td
              class="table-style"
              colspan="3">
              모델 포트폴리오 위험도
            </td>
            <td class="table-highlight-aggressive">3.50</td>
          </tr>
        </tbody>
      </table>
      <table
        v-else-if="userType === 'veryaggressive'"
        class="table-main-style">
        <thead>
          <tr>
            <th
              class="table-style"
              colspan="2">
              상품별 종목
            </th>
            <th class="table-style">위험등급</th>
            <th class="table-highlight-veryaggressive">공격투자형</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              class="table-style"
              rowspan="5">
              국내상품
            </td>
            <td class="table-style">국내 주식형 펀드/ETF</td>
            <td class="table-style">2등급</td>
            <td class="table-highlight-veryaggressive">21%</td>
          </tr>
          <tr>
            <td class="table-style">국내 채권 혼합형 펀드/ETF</td>
            <td class="table-style">5등급</td>
            <td class="table-highlight-veryaggressive"></td>
          </tr>
          <tr>
            <td class="table-style">국내 채권형 펀드/ETF</td>
            <td class="table-style">5등급</td>
            <td class="table-highlight-veryaggressive">5%</td>
          </tr>
          <tr>
            <td class="table-style">국내 채권형 펀드/ETF</td>
            <td class="table-style">6등급</td>
            <td class="table-highlight-veryaggressive">2%</td>
          </tr>
          <tr>
            <td class="table-style">현금성(예금 등)</td>
            <td class="table-style">6등급</td>
            <td class="table-highlight-veryaggressive">2%</td>
          </tr>
          <tr>
            <td
              class="table-style"
              rowspan="4">
              국내상품
            </td>
            <td class="table-style">해외 주식형 펀드/ETF</td>
            <td class="table-style">1등급</td>
            <td class="table-highlight-veryaggressive">8%</td>
          </tr>
          <tr>
            <td class="table-style">해외 주식형 펀드/ETF</td>
            <td class="table-style">2등급</td>
            <td class="table-highlight-veryaggressive">40%</td>
          </tr>
          <tr>
            <td class="table-style">해외 주식형 펀드/ETF</td>
            <td class="table-style">3등급</td>
            <td class="table-highlight-veryaggressive">22%</td>
          </tr>

          <tr>
            <td class="table-style">해외 채권형 펀드/ETF</td>
            <td class="table-style">4등급</td>
            <td class="table-highlight-veryaggressive"></td>
          </tr>
          <tr>
            <td
              class="table-style"
              colspan="3">
              위험자산 <small class="notice">**</small> 비중
            </td>
            <td class="table-highlight-veryaggressive">91%</td>
          </tr>
          <tr>
            <td
              class="table-style"
              colspan="3">
              모델 포트폴리오 위험도
            </td>
            <td class="table-highlight-veryaggressive">2.45</td>
          </tr>
        </tbody>
      </table>
      <!-- TableSection end -->

      <!-- NoticeSection start -->
      <small class="notice">
        * 모범규준을 기초로 모델포트폴리오 내 편입 예정인 개별 금융상품의 위험도를 고려하여,
        편입비중으로 가중평균하여 산출합니다.<br />
        * 반드시 투자자유형에 맞는 모델포트폴리오(MP)를 권유하여야 하며 투자자유형보다 위험등급이
        높은 MP는 가입이 불가합니다.<br />
        ** 위험자산군 = (매우높은위험+높은위험+다소높은위험)
      </small>
      <!-- NoticeSection end -->
    </div>
  </section>
</template>

<script setup>
// imports
import { useRouter } from 'vue-router';
import { ref } from 'vue';

// func.
const router = useRouter();
const goToMain = () => {
  router.push('/');
};
const name = ref('이진욱');
const userType = ref('neutral'); // 예: 고객의 투자유형이 '안정형인 경우'
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
.sub-title {
  background: var(--main01);
  padding: 10px 3px 5px 3px;
  border: none;
  border-radius: 5px;
  font-size: 15px;
}

/* MainSection styles */
.sub-section {
  margin-bottom: 30px;
  border: 3px solid var(--main03);
  border-radius: 5px;
  background-color: var(--main05);
  height: auto;
}
.result-section {
  margin: 10px 10px 10px 10px;
}

/* Button Styles */
.close-button {
  background: transparent;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}
.title-button-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* GraphSection style */
.chart-image {
  display: block;
  margin: 0 auto;
  width: 350px; /* 너비 조절 */
  height: auto; /* 비율 유지 */
}

/* TableSection style */
.table-main-style {
  border-collapse: collapse;
  width: 100%;
}
.table-style {
  border: 1px solid var(--main03);
  text-align: center;
  padding: 8px 10px;
}

.table-highlight-stable {
  color: var(--mint01);
  font-weight: bold;
  background-color: var(--mint02);
  border: 2px solid var(--mint01);
  text-align: center;
}

.table-highlight-veryaggressive {
  color: var(--red01);
  font-weight: bold;
  background-color: var(--red02);
  border: 2px solid var(--red01);
  text-align: center;
}
.table-highlight-aggressive {
  color: var(--orange01);
  font-weight: bold;
  background-color: var(--orange02);
  border: 2px solid var(--orange01);
  text-align: center;
}
.table-highlight-neutral {
  color: var(--yellow01);
  font-weight: bold;
  background-color: var(--yellow02);
  border: 2px solid var(--yellow01);
  text-align: center;
}
.table-highlight-stableplus {
  color: var(--green01);
  font-weight: bold;
  background-color: var(--green02);
  border: 2px solid var(--green01);
  text-align: center;
}
.highlight-stable {
  color: var(--mint01);
  font-weight: bold;
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
.highlight-white {
  color: var(--main05);
  font-weight: bold;
}

.highlight-veryaggressive {
  color: var(--red01);
  font-weight: bold;
}
.highlight-aggressive {
  color: var(--orange01);
  font-weight: bold;
}
.highlight-neutral {
  color: var(--yellow01);
  font-weight: bold;
}
.highlight-stableplus {
  color: var(--green01);
  font-weight: bold;
}

/* NoticeSection style */
.notice {
  margin-top: 18px;
  font-size: var(--font-size-sm);
  color: #8c8c8c;
}
</style>

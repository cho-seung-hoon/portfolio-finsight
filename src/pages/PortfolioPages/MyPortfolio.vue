<template>
  <!-- ResultMainSection start -->
  <section
    class="sub-title"
    style="margin-top: 20px">
    <!-- <div class="result-section"> -->
    <h2 class="subItem1">
      <span class="subItem2">{{ UserInfoA.userName }}님은</span>
      <span :class="['invt', profileClass]">"{{ investmentProfileType }}"</span>
      <span class="subItem2">입니다.</span>
    </h2>
    <!-- </div> -->
  </section>
  <!-- ResultMainSection end -->

  <section class="sub-section">
    <div class="result-section">
      <div class="comment-wrapper">
        <img
          class="comment-img"
          src="@/assets/cha2.png"
          alt="cha" />
        <span class="subItem1">"상황 별 코멘트"</span>
      </div>

      <!-- TableSection start -->
      <div class="table-container">
        <table class="table-main-style">
          <thead>
            <tr>
              <th class="table-header">상품별 종목</th>
              <th class="table-header">위험 등급</th>
              <th class="table-header">
                나의 자산 / <span :class="['invt', profileClass]">{{ investmentProfileType }}</span>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td class="table-cell">국내 주식형 펀드/ETF</td>
              <td class="table-cell">2등급</td>
              <td class="table-cell">
                <span>{{ domesticEquity2 }} % </span>
                <span :class="['invt', profileClass]">/ {{ selectedRecom[0] }} %</span>
              </td>
            </tr>
            <tr>
              <td class="table-cell">국내 채권혼합형 펀드/ETF</td>
              <td class="table-cell">5등급</td>
              <td class="table-cell">
                <span>{{ domesticMixed5 }} % </span>
                <span :class="['invt', profileClass]">/ {{ selectedRecom[1] }} %</span>
              </td>
            </tr>
            <tr>
              <td class="table-cell">국내 채권형 펀드/ETF</td>
              <td class="table-cell">5등급</td>
              <td class="table-cell">
                <span>{{ domesticBond5 }} % </span>
                <span :class="['invt', profileClass]">/ {{ selectedRecom[2] }} %</span>
              </td>
            </tr>
            <tr>
              <td class="table-cell">국내 채권형 펀드/ETF</td>
              <td class="table-cell">6등급</td>
              <td class="table-cell">
                <span>{{ domesticBond6 }} % </span>
                <span :class="['invt', profileClass]">/ {{ selectedRecom[3] }} %</span>
              </td>
            </tr>
            <tr>
              <td class="table-cell">현금성(예금 등)</td>
              <td class="table-cell">6등급</td>
              <td class="table-cell">
                <span>{{ depositPrice }} % </span>
                <span :class="['invt', profileClass]">/ {{ selectedRecom[4] }} %</span>
              </td>
            </tr>
            <tr>
              <td class="table-cell">해외 주식형 펀드/ETF</td>
              <td class="table-cell">1등급</td>
              <td class="table-cell">
                <span>{{ foreignEquity1 }} % </span>
                <span :class="['invt', profileClass]">/ {{ selectedRecom[5] }} %</span>
              </td>
            </tr>
            <tr>
              <td class="table-cell">해외 주식형 펀드/ETF</td>
              <td class="table-cell">2등급</td>
              <td class="table-cell">
                <span>{{ foreignEquity2 }} % </span>
                <span :class="['invt', profileClass]">/ {{ selectedRecom[6] }} %</span>
              </td>
            </tr>
            <tr>
              <td class="table-cell">해외 주식형 펀드/ETF</td>
              <td class="table-cell">3등급</td>
              <td class="table-cell">
                <span>{{ foreignEquity3 }} % </span>
                <span :class="['invt', profileClass]">/ {{ selectedRecom[7] }} %</span>
              </td>
            </tr>
            <tr>
              <td class="table-cell">해외 채권형 펀드/ETF</td>
              <td class="table-cell">4등급</td>
              <td class="table-cell">
                <span>{{ foreignBond4 }} % </span>
                <span :class="['invt', profileClass]">/ {{ selectedRecom[8] }} %</span>
              </td>
            </tr>
            <tr>
              <td
                class="table-cell summary-label"
                colspan="2">
                위험자산군** 비중
              </td>
              <td
                class="table-cell"
                :class="['invt', profileClass]">
                {{ selectedRecom[9] }}
              </td>
            </tr>
            <tr>
              <td
                class="table-cell summary-label"
                colspan="2">
                모델 포트폴리오 위험도
              </td>
              <td
                class="table-cell"
                :class="['invt', profileClass]">
                {{ selectedRecom[10] }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- TableSection end -->

      <!-- NoticeSection start -->
      <br />
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
import { computed } from 'vue';
import { onMounted, ref } from 'vue';
import { fetchUserInfoApi, getInvestmentProfileApi } from '@/api/user';
import { getDepositHoldingsApi, getMyPortfolioApi } from '@/api/tradeApi';

// === ✅ 개인정보 GET 호출 ===========================
const UserInfoA = ref({
  userId: '',
  userName: ''
});
const getUserInfo = async () => {
  try {
    const response = await fetchUserInfoApi();
    UserInfoA.value = response.data;
    console.log(UserInfoA.value);
  } catch (e) {
    console.error('유저 정보 불러오기 실패:', e);
  }
};

// === ✅ 투자성향 GET 호출 ===========================
const profileClass = ref('');
const translateProfileType = type => {
  switch (type) {
    case 'stable':
      return '안정형';
    case 'stableplus':
      return '안정추구형';
    case 'neutral':
      return '위험중립형';
    case 'aggressive':
      return '적극투자형';
    case 'veryaggressive':
      return '공격투자형';
    default:
      return '알 수 없음';
  }
};
const getProfileClass = type => {
  switch (type) {
    case 'stable':
      return 'highlight-stable';
    case 'stableplus':
      return 'highlight-stableplus';
    case 'neutral':
      return 'highlight-neutral';
    case 'aggressive':
      return 'highlight-aggressive';
    case 'veryaggressive':
      return 'highlight-veryaggressive';
    default:
      return '';
  }
};
const investmentProfileType = ref('');
const rawProfileType = ref('');
const getUserType = async () => {
  try {
    const response = await getInvestmentProfileApi();
    const type = response.data.investmentProfileType;
    investmentProfileType.value = translateProfileType(type);
    rawProfileType.value = type;
    profileClass.value = getProfileClass(type);
    console.log('---------------');
    console.log('투자성향결과:', type);
  } catch (e) {
    console.error('투자성향 불러오기 실패: ', e);
  }
};

// === ✅ GET 호출된 데이터들 Mounted 하기 ==============
onMounted(() => {
  getUserInfo();
  getUserType();
});

// === ✅ 상품정보 데이터 ==============
const pdt_tdl = [
  { type: 'stable', recom: [0, 0, 0, 98, 2, 0, 0, 0, 0, 0, 6.0] },
  { type: 'stableplus', recom: [7, 12, 5, 59, 2, 0, 10, 5, 0, 22, 5.0] },
  { type: 'neutral', recom: [8, 10, 6, 34, 2, 0, 28, 12, 0, 48, 4.04] },
  { type: 'aggressive', recom: [10, 0, 10, 23, 2, 4, 32, 14, 5, 60, 3.5] },
  { type: 'veryaggressive', recom: [21, 0, 5, 2, 2, 8, 40, 22, 0, 91, 2.45] }
];

// (1) 데이터와 성향을 묶기
const selectedRecom = computed(() => {
  const match = pdt_tdl.find(p => p.type === rawProfileType.value);
  return match ? match.recom : [];
});

// === ✅ 사용자의 실제 데이터 (예금) ==============
const domesticEquity2 = ref(null);
const domesticMixed5 = ref(null);
const domesticBond5 = ref(null);
const domesticBond6 = ref(null);

const depositPrice = ref(null);

const foreignEquity1 = ref(null);
const foreignEquity2 = ref(null);
const foreignEquity3 = ref(null);
const foreignBond4 = ref(null);

const getMp = async () => {
  try {
    const response = await getMyPortfolioApi();
    console.log('------ 국내 펀드/ETF ------');
    domesticEquity2.value = response.data.domesticEquity2;
    console.log('국내 주식형(2) 펀드/ETF[%]: ', domesticEquity2.value);

    domesticMixed5.value = response.data.domesticMixed5;
    console.log('국내 채권혼합형(5) 펀드/ETF[%]: ', domesticMixed5.value);

    domesticBond5.value = response.data.domesticBond5;
    console.log('국내 채권형(5) 펀드/ETF[%]: ', domesticBond5.value);

    domesticBond6.value = response.data.domesticBond6;
    console.log('국내 채권형(6) 펀드/ETF[%]: ', domesticBond6.value);

    console.log('------ 해외 펀드/ETF ------');
    foreignEquity1.value = response.data.foreignEquity1;
    console.log('해외 주식형(1) 펀드/ETF[%]: ', foreignEquity1.value);

    foreignEquity2.value = response.data.foreignEquity2;
    console.log('해외 주식형(2) 펀드/ETF[%]: ', foreignEquity2.value);

    foreignEquity3.value = response.data.foreignEquity3;
    console.log('해외 주식형(3) 펀드/ETF[%]: ', foreignEquity3.value);

    foreignBond4.value = response.data.foreignBond4;
    console.log('해외 채권형(4) 펀드/ETF[%]: ', foreignBond4.value);
  } catch (error) {
    console.error('펀드/ETF 가져오기 실패:', error);
    domesticEquity2.value = 0; // 에러 시 0으로 대체
    domesticMixed5.value = 0;
    domesticBond5.value = 0;
    domesticBond6.value = 0;
    foreignEquity1.value = 0;
    foreignEquity2.value = 0;
    foreignEquity3.value = 0;
    foreignBond4.value = 0;
  }
};

const getDepositPrice = async () => {
  try {
    const response = await getDepositHoldingsApi();
    depositPrice.value = response.data.depositPrice;
    console.log('예금수량[%]: ', depositPrice.value);
  } catch (error) {
    console.error('예금 수량 가져오기 실패:', error);
    depositPrice.value = 0; // 에러 시 0으로 대체
  }
};

onMounted(() => {
  getDepositPrice();
  getMp();
});
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
  background: var(--main03);
  padding: 5px 3px 5px 3px;
  border: 5px solid var(--main02);
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

/* TableSection style */
.table-main-style {
  border-collapse: collapse;
  width: 100%;
}
.table-header {
  background: var(--main01);
  color: white;
  font-weight: 600;
  padding-top: 10px;
  padding-bottom: 10px;
  text-align: center;
  font-size: 15px;
  border: none;
  line-height: 1.2;
  word-break: keep-all;
}
.table-cell {
  padding-top: 10px;
  padding-bottom: 10px;
  text-align: center;
  border-bottom: 1px solid var(--main04);
  font-size: 12px;
  word-break: keep-all;
}

.table-cell.user-allocation {
  color: var(--main01);
  background-color: rgba(0, 123, 255, 0.1);
  border-left: 3px solid var(--main01);
}

.table-cell.summary-label {
  text-align: center;
  font-weight: 600;
  color: var(--main01);
  background-color: #f8f9fa;
}

.table-highlight-stable {
  color: var(--mint01);
  font-weight: bold;
  background-color: var(--mint02);
  border-left: 3px solid var(--mint01);
}
.table-highlight-stableplus {
  color: var(--green01);
  font-weight: bold;
  background-color: var(--green02);
  border-left: 3px solid var(--green01);
}
.table-highlight-neutral {
  color: var(--yellow01);
  font-weight: bold;
  background-color: var(--yellow02);
  border-left: 3px solid var(--yellow01);
}
.table-highlight-aggressive {
  color: var(--orange01);
  font-weight: bold;
  background-color: var(--orange02);
  border-left: 3px solid var(--orange01);
}
.table-highlight-veryaggressive {
  color: var(--red01);
  font-weight: bold;
  background-color: var(--red02);
  border-left: 3px solid var(--red01);
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

/* NoticeSection style */
.notice {
  margin-top: 18px;
  font-size: var(--font-size-sm);
  color: #8c8c8c;
}
.subItem1 {
  margin: 15px;
  display: flex;
  justify-content: center;
}
.comment-img {
  width: 200px;
  height: 110px; /* ← 절대 높이 설정 */
  object-fit: cover;
  object-position: top;
}
.comment-wrapper {
  padding-left: 15px;
  padding-right: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.subItem2 {
  padding-right: 5px;
  color: var(--main01);
}
</style>

<template>
  <div class="main-section">
    <section class="main-title">
      <span :class="['invt', profileClass]">{{ investmentProfileType }}</span>
      <span>을 위한 자산 배분안</span>
    </section>
    <!-- Main Section start -->
    <section class="sub-section">
      <div class="result-section">
        <div class="comment-wrapper">
          <img
            class="comment-img"
            src="@/assets/cha2.png"
            alt="cha" />
          <span class="subItem1">Fin-Sight와 함께하는<br />성공적인 재테크 !!</span>
        </div>
        <table class="table-main-style">
          <thead>
            <tr>
              <th class="table-header">상품별 종목</th>
              <th class="table-header">위험 등급</th>
              <th class="table-header">
                <span :class="['invt', profileClass]">{{ investmentProfileType }}</span>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td class="table-cell">국내 주식형 펀드/ETF</td>
              <td class="table-cell">2등급</td>
              <td class="table-cell">
                <span :class="['invt', profileClass]">{{ selectedRecom[0] }} %</span>
              </td>
            </tr>
            <tr>
              <td class="table-cell">국내 채권혼합형 펀드/ETF</td>
              <td class="table-cell">5등급</td>
              <td class="table-cell">
                <span :class="['invt', profileClass]">{{ selectedRecom[1] }} %</span>
              </td>
            </tr>
            <tr>
              <td class="table-cell">국내 채권형 펀드/ETF</td>
              <td class="table-cell">5등급</td>
              <td class="table-cell">
                <span :class="['invt', profileClass]">{{ selectedRecom[2] }} %</span>
              </td>
            </tr>
            <tr>
              <td class="table-cell">국내 채권형 펀드/ETF</td>
              <td class="table-cell">6등급</td>
              <td class="table-cell">
                <span :class="['invt', profileClass]">{{ selectedRecom[3] }} %</span>
              </td>
            </tr>
            <tr>
              <td class="table-cell">현금성(예금 등)</td>
              <td class="table-cell">6등급</td>
              <td class="table-cell">
                <span :class="['invt', profileClass]">{{ selectedRecom[4] }} %</span>
              </td>
            </tr>
            <tr>
              <td class="table-cell">해외 주식형 펀드/ETF</td>
              <td class="table-cell">1등급</td>
              <td class="table-cell">
                <span :class="['invt', profileClass]">{{ selectedRecom[5] }} %</span>
              </td>
            </tr>
            <tr>
              <td class="table-cell">해외 주식형 펀드/ETF</td>
              <td class="table-cell">2등급</td>
              <td class="table-cell">
                <span :class="['invt', profileClass]">{{ selectedRecom[6] }} %</span>
              </td>
            </tr>
            <tr>
              <td class="table-cell">해외 주식형 펀드/ETF</td>
              <td class="table-cell">3등급</td>
              <td class="table-cell">
                <span :class="['invt', profileClass]">{{ selectedRecom[7] }} %</span>
              </td>
            </tr>
            <tr>
              <td class="table-cell">해외 채권형 펀드/ETF</td>
              <td class="table-cell">4등급</td>
              <td class="table-cell">
                <span :class="['invt', profileClass]">{{ selectedRecom[8] }} %</span>
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

        <!-- Notice Section start -->
        <small class="notice">
          * 모범규준을 기초로 모델포트폴리오 내 편입 예정인 개별 금융상품의 위험도를 고려하여,
          편입비중으로 가중평균하여 산출합니다.<br />
          * 반드시 투자자유형에 맞는 모델포트폴리오(MP)를 권유하여야 하며 투자자유형보다 위험등급이
          높은 MP는 가입이 불가합니다.<br />
          ** 위험자산군 = (매우높은위험+높은위험+다소높은위험)
        </small>
        <!-- Notice Section start -->
      </div>
    </section>
    <!-- Main Section end -->

    <!-- gotoMain Button start -->
    <button
      class="gotomain-button"
      @click="goToMain">
      홈 화면으로 가기
    </button>
    <!-- gotoMain Button end -->
  </div>
</template>

<script setup>
// imports
import { useRouter, useRoute } from 'vue-router';
import { onMounted, computed, ref } from 'vue';
import { fetchInvestmentProfileApi, fetchUserInfoApi } from '@/api/user';

// Route Section
const router = useRouter();
const goToMain = () => {
  router.push('/');
};

// RiskType Section
const route = useRoute();
const RiskType = ref('');

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
    const response = await fetchInvestmentProfileApi();
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
</script>

<style scoped>
.main-section {
  background: var(--off-white);
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: calc(100dvh - 56px);
}
.comment-wrapper {
  padding-left: 15px;
  padding-right: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.subItem1 {
  margin: 15px;
  display: flex;
  justify-content: center;
}
.main-title {
  padding-top: 15px;
  padding-bottom: 15px;
  margin-left: 15px;
  font-size: 23px;
  color: var(--main01);
  font-weight: bold;
}

.result-section {
  margin: 10px 10px 10px 10px;
}

/* Main Section Styles */
.sub-section {
  border: 1px solid var(--main03);
  border-radius: 5px;
  background-color: var(--white);
  height: auto;
}
.comment-img {
  width: 200px;
  height: 110px; /* ← 절대 높이 설정 */
  object-fit: cover;
  object-position: top;
}
.title {
  font-size: var(--font-size-md);
}

/* Table Section style */
.table-main-style {
  border-collapse: collapse;
  width: 100%;
}

.table-style {
  border: 1px solid var(--main03);
  text-align: center;
  padding: 8px 10px;
}

/* Table Highlight Styles */
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

.table-highlight-stable {
  color: var(--mint01);
  font-weight: bold;
  background-color: var(--mint02);
  border: 2px solid var(--mint01);
  text-align: center;
}

/* Text Highlight Styles */
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

.highlight-stable {
  color: var(--mint01);
  font-weight: bold;
}

/* NoticeSection Styles */
.notice {
  margin-top: 180px;
  font-size: var(--font-size-sm);
  color: #8c8c8c;
}

/* Button Styles */
.gotomain-button {
  width: 100%;
  padding: 16px 0;
  background: var(--main01);
  color: var(--white);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-md);
  cursor: pointer;
  border-radius: 8px;
  margin-top: auto;
  margin-bottom: 60px;
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
</style>

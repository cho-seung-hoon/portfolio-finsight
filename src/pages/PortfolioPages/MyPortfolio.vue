<template>
  <section class="sub-title" style="margin-top: 20px">
    <div class="subItem1">
      <span class="iconBell">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <g
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
          >
            <g>
              <path stroke-dasharray="4" stroke-dashoffset="4" d="M12 3v2">
                <animate
                  fill="freeze"
                  attributeName="stroke-dashoffset"
                  dur="0.2s"
                  values="4;0"
                />
              </path>
              <path
                fill="currentColor"
                fill-opacity="0"
                stroke-dasharray="28"
                stroke-dashoffset="28"
                d="M12 5c-3.31 0 -6 2.69 -6 6l0 6c-1 0 -2 1 -2 2h8M12 5c3.31 0 6 2.69 6 6l0 6c1 0 2 1 2 2h-8"
              >
                <animate
                  fill="freeze"
                  attributeName="fill-opacity"
                  begin="0.9s"
                  dur="0.5s"
                  values="0;1"
                />
                <animate
                  fill="freeze"
                  attributeName="stroke-dashoffset"
                  begin="0.2s"
                  dur="0.4s"
                  values="28;0"
                />
              </path>
              <animateTransform
                fill="freeze"
                attributeName="transform"
                begin="0.9s"
                dur="6s"
                keyTimes="0;0.05;0.15;0.2;1"
                type="rotate"
                values="0 12 3;3 12 3;-3 12 3;0 12 3;0 12 3"
              />
            </g>
            <path
              stroke-dasharray="8"
              stroke-dashoffset="8"
              d="M10 20c0 1.1 0.9 2 2 2c1.1 0 2 -0.9 2 -2"
            >
              <animate
                fill="freeze"
                attributeName="stroke-dashoffset"
                begin="0.6s"
                dur="0.2s"
                values="8;0"
              />
              <animateTransform
                fill="freeze"
                attributeName="transform"
                begin="1.1s"
                dur="6s"
                keyTimes="0;0.05;0.15;0.2;1"
                type="rotate"
                values="0 12 8;6 12 8;-6 12 8;0 12 8;0 12 8"
              />
            </path>
          </g>
        </svg>
      </span>
      <span class="subItem2">{{ UserInfoA.userName }}님은</span>
      <span :class="['invt', profileClass]">"{{ investmentProfileType }}"</span>
      <span class="subItem2">입니다.</span>
    </div>
  </section>
  <section class="sub-section">
    <div class="result-section">
      <div class="table-container">
        <table class="table-main-style">
          <thead>
          <tr>
            <th class="table-header">상품별 종목</th>
            <th class="table-header">위험 등급</th>
            <th class="table-header">
              나의 자산 /
              <span :class="['invt', profileClass]">{{
                  investmentProfileType
                }}</span>
            </th>
          </tr>
          </thead>

          <tbody>
          <tr>
            <td class="table-cell">국내 주식형 펀드/ETF</td>
            <td class="table-cell">2등급</td>
            <td class="table-cell">
              <span>{{ formatPercentage(domesticEquity2) }} % </span>
              <span :class="['invt', profileClass]"
              >/ {{ selectedRecom[0] }} %</span
              >
            </td>
          </tr>
          <tr>
            <td class="table-cell">국내 채권혼합형 펀드/ETF</td>
            <td class="table-cell">5등급</td>
            <td class="table-cell">
              <span>{{ formatPercentage(domesticMixed5) }} % </span>
              <span :class="['invt', profileClass]"
              >/ {{ selectedRecom[1] }} %</span
              >
            </td>
          </tr>
          <tr>
            <td class="table-cell">국내 채권형 펀드/ETF</td>
            <td class="table-cell">5등급</td>
            <td class="table-cell">
              <span>{{ formatPercentage(domesticBond5) }} % </span>
              <span :class="['invt', profileClass]"
              >/ {{ selectedRecom[2] }} %</span
              >
            </td>
          </tr>
          <tr>
            <td class="table-cell">국내 채권형 펀드/ETF</td>
            <td class="table-cell">6등급</td>
            <td class="table-cell">
              <span>{{ formatPercentage(domesticBond6) }} % </span>
              <span :class="['invt', profileClass]"
              >/ {{ selectedRecom[3] }} %</span
              >
            </td>
          </tr>
          <tr>
            <td class="table-cell">현금성(예금 등)</td>
            <td class="table-cell">6등급</td>
            <td class="table-cell">
              <span>{{ formatPercentage(depositPrice) }} % </span>
              <span :class="['invt', profileClass]"
              >/ {{ selectedRecom[4] }} %</span
              >
            </td>
          </tr>
          <tr>
            <td class="table-cell">해외 주식형 펀드/ETF</td>
            <td class="table-cell">1등급</td>
            <td class="table-cell">
              <span>{{ formatPercentage(foreignEquity1) }} % </span>
              <span :class="['invt', profileClass]"
              >/ {{ selectedRecom[5] }} %</span
              >
            </td>
          </tr>
          <tr>
            <td class="table-cell">해외 주식형 펀드/ETF</td>
            <td class="table-cell">2등급</td>
            <td class="table-cell">
              <span>{{ formatPercentage(foreignEquity2) }} % </span>
              <span :class="['invt', profileClass]"
              >/ {{ selectedRecom[6] }} %</span
              >
            </td>
          </tr>
          <tr>
            <td class="table-cell">해외 주식형 펀드/ETF</td>
            <td class="table-cell">3등급</td>
            <td class="table-cell">
              <span>{{ formatPercentage(foreignEquity3) }} % </span>
              <span :class="['invt', profileClass]"
              >/ {{ selectedRecom[7] }} %</span
              >
            </td>
          </tr>
          <tr>
            <td class="table-cell">해외 채권형 펀드/ETF</td>
            <td class="table-cell">4등급</td>
            <td class="table-cell">
              <span>{{ formatPercentage(foreignBond4) }} % </span>
              <span :class="['invt', profileClass]"
              >/ {{ selectedRecom[8] }} %</span
              >
            </td>
          </tr>
          <tr>
            <td class="table-cell summary-label" colspan="2">
              위험자산군** 비중
            </td>
            <td class="table-cell" :class="['invt', profileClass]">
              {{ selectedRecom[9] }}
            </td>
          </tr>
          <tr>
            <td class="table-cell summary-label" colspan="2">
              모델 포트폴리오 위험도
            </td>
            <td class="table-cell" :class="['invt', profileClass]">
              {{ selectedRecom[10] }}
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <br />
      <small class="notice">
        * 모범규준을 기초로 모델포트폴리오 내 편입 예정인 개별 금융상품의
        위험도를 고려하여, 편입비중으로 가중평균하여 산출합니다.<br />
        * 반드시 투자자유형에 맞는 모델포트폴리오(MP)를 권유하여야 하며
        투자자유형보다 위험등급이 높은 MP는 가입이 불가합니다.<br />
        ** 위험자산군 = (매우높은위험+높은위험+다소높은위험)
      </small>
    </div>
  </section>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue';
import { fetchUserInfoApi, getInvestmentProfileApi } from '@/api/user';
import { getPortfolioApi } from '@/api/tradeApi';

const UserInfoA = ref({ userName: '' });
const profileClass = ref('');
const investmentProfileType = ref('');
const rawProfileType = ref('');

const getUserAndProfileInfo = async () => {
  try {
    const [userResponse, profileResponse] = await Promise.all([
      fetchUserInfoApi(),
      getInvestmentProfileApi()
    ]);

    UserInfoA.value = userResponse.data;

    const type = profileResponse.data.investmentProfileType;
    rawProfileType.value = type;
    investmentProfileType.value = translateProfileType(type);
    profileClass.value = getProfileClass(type);
  } catch (e) {
    console.error('사용자 또는 프로필 정보 불러오기 실패:', e);
  }
};

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

const pdt_tdl = [
  { type: 'stable', recom: [0, 0, 0, 98, 2, 0, 0, 0, 0, 0, 6.0] },
  { type: 'stableplus', recom: [7, 12, 5, 59, 2, 0, 10, 5, 0, 22, 5.0] },
  { type: 'neutral', recom: [8, 10, 6, 34, 2, 0, 28, 12, 0, 48, 4.04] },
  { type: 'aggressive', recom: [10, 0, 10, 23, 2, 4, 32, 14, 5, 60, 3.5] },
  { type: 'veryaggressive', recom: [21, 0, 5, 2, 2, 8, 40, 22, 0, 91, 2.45] }
];
const selectedRecom = computed(() => {
  const match = pdt_tdl.find(p => p.type === rawProfileType.value);
  return match ? match.recom : Array(11).fill(0);
});

const domesticEquity2 = ref(0);
const domesticMixed5 = ref(0);
const domesticBond5 = ref(0);
const domesticBond6 = ref(0);
const depositPrice = ref(0); // '예금 비중'을 의미
const foreignEquity1 = ref(0);
const foreignEquity2 = ref(0);
const foreignEquity3 = ref(0);
const foreignBond4 = ref(0);

const fetchPortfolioData = async () => {
  try {
    const response = await getPortfolioApi(); // API 호출 한번!

    console.log('포트폴리오', response);
    const assets = response.data.assets;

    domesticEquity2.value = assets.domesticEquity2.percentage;
    domesticMixed5.value = assets.domesticMixed5.percentage;
    domesticBond5.value = assets.domesticBond5.percentage;
    domesticBond6.value = assets.domesticBond6.percentage;
    depositPrice.value = assets.deposit.percentage;
    foreignEquity1.value = assets.foreignEquity1.percentage;
    foreignEquity2.value = assets.foreignEquity2.percentage;
    foreignEquity3.value = assets.foreignEquity3.percentage;
    foreignBond4.value = assets.foreignBond4.percentage;
  } catch (error) {
    console.error('포트폴리오 데이터 가져오기 실패:', error);
    domesticEquity2.value = 0;
    domesticMixed5.value = 0;
    domesticBond5.value = 0;
    domesticBond6.value = 0;
    depositPrice.value = 0;
    foreignEquity1.value = 0;
    foreignEquity2.value = 0;
    foreignEquity3.value = 0;
    foreignBond4.value = 0;
  }
};

const formatPercentage = (value) => {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0.00';
  }
  return value.toFixed(2);
};

onMounted(async () => {
  await getUserAndProfileInfo();
  await fetchPortfolioData();
});
</script>

<style scoped>
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
  background: var(--white);
  font-size: var(--font-size-md);
  margin-bottom: 10px;
  border: 1px solid var(--main04);
}
.iconBell{
  color:var(--main01);
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
/* MainSection styles */
.sub-section {
  margin-bottom: 30px;
  border: 1px solid var(--main04);
  background-color: var(--white);
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
  font-weight: var(--font-weight-medium);
  padding-top: 10px;
  padding-bottom: 10px;
  text-align: center;
  font-size: var(--font-size-ms);
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
  align-items: center;
}

.comment-img {
  width: 150px;
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

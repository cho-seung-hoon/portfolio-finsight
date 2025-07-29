<!-- 
    작성자: JY
    작성일자: 2025-07-29
    페이지명: 투자성향분석-포트폴리오-페이지
        [경로]
        path: '/portfolio-page',
        name: 'PortfolioPage',
        component: PortfolioPage,
-->

<template>
<!-- GlobalHeader Section -->
<br>

<!-- Header Section start-->
<section class="sub-title">
    <div class="result-section">
        <h2>
            <span :class="`highlight-${userType}`">
                <template v-if="userType === 'stable'">안정형</template>
                <template v-else-if="userType === 'stableplus'">안정추구형</template>
                <template v-else-if="userType === 'neutral'">위험중립형</template>
                <template v-else-if="userType === 'aggressive'">적극투자형</template>
                <template v-else-if="userType === 'veryaggressive'">공격투자형</template>
            </span>
            <span class="highlight-white">을 위한 포트폴리오</span>
        </h2>
    </div>
</section>
<!-- Header Section end -->

<!-- Main Section start -->
<section class="sub-section">
    <div class="result-section">
        <h2>Fin-sight 추천 자산비중</h2><br>

        <!-- [01] Stable Type Table -->
        <table v-if="userType === 'stable'" class="table-main-style">
            <thead>
                <tr>
                    <th class="table-style">상품별 종목</th>
                    <th class="table-style">위험등급</th>
                    <th class="table-highlight-stable">안정형</th>
                </tr>
            </thead>
            <tbody>
                <tr>
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
                    <td class="table-style" colspan="2">위험자산
                        <small class="notice">**</small> 비중
                    </td>
                <td class="table-highlight-stable">0%</td>
                </tr>
                <tr>
                    <td class="table-style" colspan="2">모델 포트폴리오 위험도</td>
                    <td class="table-highlight-stable">6.00</td>
                </tr>
            </tbody>
        </table>

        <!-- [02] StablePlus Type Table -->
        <table v-if="userType === 'stableplus'" class="table-main-style">
            <thead>
                <tr>
                    <th class="table-style">상품별 종목</th>
                    <th class="table-style">위험등급</th>
                    <th class="table-highlight-stableplus">안정추구형</th>
                </tr>
            </thead>
            <tbody>
                <tr>
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
                    <td class="table-style" colspan="2">위험자산
                        <small class="notice">**</small> 비중
                    </td>
                    <td class="table-highlight-stableplus">22%</td>
                </tr>
                <tr>
                    <td class="table-style" colspan="2">모델 포트폴리오 위험도</td>
                    <td class="table-highlight-stableplus">5.00</td>
                </tr>
            </tbody>
        </table>

        <!-- [03] Neutral Type Table -->
        <table v-if="userType === 'neutral'" class="table-main-style">
            <thead>
                <tr>
                    <th class="table-style">상품별 종목</th>
                    <th class="table-style">위험등급</th>
                    <th class="table-highlight-neutral">위험중립형</th>
                </tr>
            </thead>
            <tbody>
                <tr>
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
                    <td class="table-style" colspan="2">위험자산
                        <small class="notice">**</small> 비중
                    </td>
                    <td class="table-highlight-neutral">48%</td>
                </tr>
                <tr>
                    <td class="table-style" colspan="2">모델 포트폴리오 위험도</td>
                    <td class="table-highlight-neutral">4.04</td>
                </tr>
            </tbody>
        </table>

        <!-- [04] Aggressive Type Table -->
        <table v-if="userType === 'aggressive'" class="table-main-style">
            <thead>
                <tr>
                    <th class="table-style">상품별 종목</th>
                    <th class="table-style">위험등급</th>
                    <th class="table-highlight-aggressive">적극투자형</th>
                </tr>
            </thead>
            <tbody>
                <tr>
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
                    <td class="table-style" colspan="2">위험자산
                        <small class="notice">**</small> 비중
                    </td>
                    <td class="table-highlight-aggressive">60%</td>
                </tr>
                <tr>
                    <td class="table-style" colspan="2">모델 포트폴리오 위험도</td>
                    <td class="table-highlight-aggressive">3.50</td>
                </tr>
            </tbody>
        </table>

        <!-- [05] VeryAggressive Type Table -->
        <table v-else-if="userType === 'veryaggressive'" class="table-main-style">
            <thead>
                <tr>
                    <th class="table-style">상품별 종목</th>
                    <th class="table-style">위험등급</th>
                    <th class="table-highlight-veryaggressive">공격투자형</th>
                </tr>
            </thead>
            <tbody>
                <tr>
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
                    <td class="table-style" colspan="2">위험자산
                        <small class="notice">**</small> 비중
                    </td>
                    <td class="table-highlight-veryaggressive">91%</td>
                </tr>
                <tr>
                    <td class="table-style" colspan="2">모델 포트폴리오 위험도</td>
                    <td class="table-highlight-veryaggressive">2.45</td>
                </tr>
            </tbody>
        </table><br>
        
        <!-- Notice Section start -->
        <small class="notice">
            * 모범규준을 기초로 모델포트폴리오 내 편입 예정인 개별 금융상품의 위험도를 고려하여, 편입비중으로 가중평균하여 산출합니다.<br>
            * 반드시 투자자유형에 맞는 모델포트폴리오(MP)를 권유하여야 하며 투자자유형보다 위험등급이 높은 MP는 가입이 불가합니다.<br>
            ** 위험자산군 = (매우높은위험+높은위험+다소높은위험)
        </small>
        <!-- Notice Section start -->
    </div>
</section>
<!-- Main Section end -->

<!-- gotoMain Button start -->
<button class="gotomain-button" @click="goToMain">홈 화면으로 가기</button>
<!-- gotoMain Button end -->
</template>
    
<script setup>
// imports
import { useRouter, useRoute } from 'vue-router'
import { ref, watch } from 'vue'

// Route Section
const router = useRouter()
const goToMain = () => {
    router.push('/')
}

// UserType Section
const route = useRoute()
const userType = ref('')

watch(() => route.query.userType, (newUserType) => {
    if (newUserType) {
        userType.value = newUserType;
    } else {
        userType.value = 'stable';
    }
},
{
    immediate: true // 컴포넌트 초기 로드 시 즉시 실행
});


</script>
    
<style scoped>
/* Header Section styles*/
.sub-title {
  background: var(--main01);
  padding: 10px 3px 5px 3px;
  border: none;
  border-radius: 5px;
  font-size: 15px;
}
.result-section {
    margin: 10px 10px 10px 10px;
}

/* Main Section Styles */
.sub-section {
  margin-bottom: 30px;
  border: 3px solid var(--main03);
  border-radius: 5px;
  background-color: var(--main05);
  height: auto;
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
  margin-top: 18px;
  font-size: var(--font-size-sm);
  color: #8c8c8c;
}

/* Button Styles */
.gotomain-button {
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
    z-index: 700;
}
</style>

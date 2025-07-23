<!-- 
작성자: JY
작성일자: 2025-07-22
페이지명: 포트폴리오-공격투자형-페이지
    [경로]
    path: '/inv-type-veryaggressive-page',
    name: 'InvTypeVeryAggressivePage',
    component: InvTypeVeryAggressivePage
-->

<template>
    <header>
        <button @click="goToMain"><</button>
        <h1>나의 포트폴리오</h1>
    </header><hr>
    <body>
        <h2><span class="veryaggressive-highligher">공격투자형</span>을 위한 모델 포트폴리오</h2><br>
        <div>
            <h3>나의 투자 유형은?</h3>
            <p>여기에 그래프를 다시 로드해요.</p>
        </div><br>
        <div>
            <h3>Fin-sight 추천 자산비중</h3>
            <table>
                    <thead>
                        <tr>
                            <th class="table-style" colspan="2">상품별 종목</th>
                            <th class="table-style">위험등급</th>
                            <th class="veryaggressive-table-highligher">공격투자형</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="table-style" rowspan="5">국내상품</td>
                            <td class="table-style">국내 주식형 펀드/ETF</td>
                            <td class="table-style">2등급</td>
                            <td class="veryaggressive-table-highligher">21%</td>
                        </tr>
                        <tr>
                            <td class="table-style">국내 채권 혼합형 펀드/ETF</td>
                            <td class="table-style">5등급</td>
                            <td class="veryaggressive-table-highligher"></td>
                        </tr>
                        <tr>
                            <td class="table-style">국내 채권형 펀드/ETF</td>
                            <td class="table-style">5등급</td>
                            <td class="veryaggressive-table-highligher">5%</td>
                        </tr>
                        <tr>
                            <td class="table-style">국내 채권형 펀드/ETF</td>
                            <td class="table-style">6등급</td>
                            <td class="veryaggressive-table-highligher">2%</td>
                        </tr>
                        <tr>
                            <td class="table-style">현금성(예금 등)</td>
                            <td class="table-style">6등급</td>
                            <td class="veryaggressive-table-highligher">2%</td>
                        </tr>
                        <tr>
                            <td class="table-style" rowspan="4">국내상품</td>
                            <td class="table-style">해외 주식형 펀드/ETF</td>
                            <td class="table-style">1등급</td>
                            <td class="veryaggressive-table-highligher">8%</td>
                        </tr>
                        <tr>
                            <td class="table-style">해외 주식형 펀드/ETF</td>
                            <td class="table-style">2등급</td>
                            <td class="veryaggressive-table-highligher">40%</td>
                        </tr>
                        <tr>
                            <td class="table-style">해외 주식형 펀드/ETF</td>
                            <td class="table-style">3등급</td>
                            <td class="veryaggressive-table-highligher">22%</td>
                        </tr>
                        <tr>
                            <td class="table-style">해외 채권형 펀드/ETF</td>
                            <td class="table-style">4등급</td>
                            <td class="veryaggressive-table-highligher"></td>
                        </tr>
                        <tr>
                            <td class="table-style" colspan="3">위험자산<small class="notice">**</small> 비중</td>
                            <td class="veryaggressive-table-highligher">91%</td>
                        </tr>
                        <tr>
                            <td class="table-style" colspan="3">모델 포트폴리오 위험도</td>
                            <td class="veryaggressive-table-highligher">2.45</td>
                        </tr>
                    </tbody>
                </table>
        </div><br>
        <div>
            <small class="notice">
                * 모범규준을 기초로 모델포트폴리오 내 편입 예정인 개별 금융상품의 위험도를 고려하여, 편입비중으로 가중평균하여 산출합니다.<br>
                * 반드시 투자자유형에 맞는 모델포트폴리오(MP)를 권유하여야 하며 투자자유형보다 위험등급이 높은 MP는 가입이 불가합니다.<br>
                ** 위험자산군 = (매우높은위험+높은위험+다소높은위험)
            </small>
        </div>
    </body>
</template>

<script setup>
// imports
import { useRouter } from 'vue-router'

// func.
const router = useRouter()
const goToMain = () => {
    router.push('/')
}
</script>

<style setup>
.veryaggressive-highligher {
    color: var(--red01);
    font-weight: bold;
}
.table-style {
    border: 1px solid;
    text-align: center;
}
.veryaggressive-table-highligher{
    color: var(--red01);
    font-weight: bold;
    background-color: var(--red02);
    border: 2px solid var(--red01);
    text-align: center;
}
.notice {
    margin-top: 18px;
    font-size: var(--font-size-sm);
    color: #8c8c8c;
}
</style>

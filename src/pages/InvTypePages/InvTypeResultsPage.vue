<!-- 
작성자: JY
작성일자: 2025-07-23
페이지명: 투자성향분석-결과-페이지
    [경로]
    path: '/inv-type-results-page',
    name: 'InvTypeResultsPage',
    component: InvTypeResultsPage
-->

<template>
<!-- TitleSection start-->
<div class="main-section">
    <h1 class="main-title">투자성향분석</h1>
</div><br>
<!-- TitleSection end-->

<!-- NoticeSection start -->
<img src="/src/assets/styles/img/notice.png" alt="notice" class="img-notice">
<span> 본 상품은 일반 예금상품과 달리 원금의 일부 또는 전부 손실이 발생할 수 있으며, 투자로 인한 손실은 투자자 본인에게 귀속됩니다.</span>
<br><br>
<!-- NoticeSection end -->

<!-- ResultMainSection start -->
<section class="sub-section">
    <div class="result-section">
        <p class="result-text">
            <strong>{{ name }}</strong>님의 투자 성향은
        </p>
        <p class="result-text">
            <span class="result-text highlight-stable">{{ invest_type }}</span>이며,
        </p>
        <p class="result-text">
            <span class="result-text highlight-stable">{{ invest_type_description }}</span>
        </p>
        <p>에 가입할 수 있어요.</p>
    </div>
</section>
<!-- ResultMainSection end -->


<!-- GrapthSection start -->
<section class="sub-section">
    <div class="result-section">
        <h2>나의 투자유형은?</h2><br>
        <img src="/src/assets/styles/img/stableChart.PNG" alt="stableChart" class="chart-image">
    </div>
</section>
<!-- GrapthSection end -->

<p class="result-text">
    <button class="notice-button" @click="goToPortfolio">적합상품 등급 안내</button>
</p><br>
<p>
    <button class="main-section complete-button" @click="goToMain">확인</button>
</p>




</template>

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
    font-size: 24px;
    font-weight: 700;
    color: var(--main05);
}

/* MainSection styles */
.sub-section {
    margin-bottom: 30px;
    border: 3px solid var(--main03);
    border-radius: 5px;
    background-color: var(--main05);
    height: auto;
}
.question-title {
    margin: 34px 40px 34px 40px;
}
.answer-list {
    margin: 0px 45px 34px 45px;
    display: auto;
}
.answer-boundary {
    border: 1px solid var(--main04);
    margin: 10px 5px 10px 5px;
}

/* ResultMainSection styles */
.result-section {
    margin: 10px 10px 10px 10px;
}
.result-text {
    margin: 0px 0px 5px 0px;
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

/* NextButton styles */
.complete-button {
    padding: 16px 0;
    background: var(--main01);
    color: var(--white);
    font-weight: 700;
    font-size: 24px;
    display: flex;
    justify-content: center; 
    border: none;
    cursor: pointer;
}

.notice-button{
    padding: 16px 16px;
    background: var(--white);
    color: var(--main01);
    border-radius: 5px;
    width: calc(100%);
    cursor: pointer;

}

/* GraphSection style */
.chart-image {
    display: block;
    margin: 0 auto;
    width: 350px; /* 너비 조절 */
    height: auto; /* 비율 유지 */
}

/* imgs style */
.img-notice {
    margin: 1px 3px auto;
    width: 18px; /* 너비 조절 */
    height: auto; /* 비율 유지 */
}

</style>

<script setup>
// imports
import { useRouter } from 'vue-router'
import { ref } from 'vue'

// func.
const name = ref('이진욱')
const invest_type = ref('안정형')
const invest_type_description = ref('원금 손실 가능성이 낮은 상품(6등급)')
const userType = ref('stable') // 예: 고객의 투자유형이 '안정형인 경우'

const router = useRouter()

const routeMap = {
    stable: '/inv-type-stable-page', // 안정형
    stableplus: '/inv-type-stableplus-page', // 안정추구형
    neutral: '/inv-type-neutral-page', // 위험중립형
    aggressive: '/inv-type-aggressive-page', // 적극투자형
    veryaggressive: '/inv-type-veryaggressive-page', // 공격투자형
    default: '/inv-type-stable-page' // default: 안정형
}

const goToPortfolio = () => {
    const path = routeMap[userType.value] || routeMap.default
    router.push(path)
}
const goToMain = () => {
    router.push('/')
}
</script>
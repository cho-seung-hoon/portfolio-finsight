<!-- 
작성자: JY
작성일자: 2025-07-25
페이지명: 투자성향분석-2단계-페이지
    [경로]
    path: '/inv-type-test-step-2-page',
    name: 'InvTypeTestStep2Page',
    component: InvTypeTestStep2Page
-->

<template>
<!-- TitleSection start-->
<div class="main-section">
    <h1 class="main-title">투자성향분석</h1>
</div><br>
<!-- TitleSection end-->

<!-- MainSection start-->
<p>고객님께서 적합한 상품을 선택 하시는데 도움을 드리기 위해 투자자정보를 제공하는 절차입니다.</p>
<ul class="sub-section-list">
    <li>다음 질문에 대해 가장 적절하다고 생각되시는 답을 선택해 주세요. 총 10문항입니다.</li>
    <li>투자성향분석은 
        <span class="highlight-blue">대면, 비대면</span>을 
        <span class="highlight-blue">통합</span>하여
        <span class="highlight-red">1일 1회</span>만 가능하니 신중하게 답해주세요.
    </li>
</ul><br>
<!-- MainSection end-->

<!-- QuestionSection (01) ~ (10) start -->
<h2>I. 기본 투자성향 파악</h2><br>

<!-- QuestionSection (01) -->
<section class="sub-section"> 
    <p class="question-title">
        <strong>Q1.</strong> 고객님의 
        <span class="highlight-blue">연령대</span>는 어떻게 되시나요?
    </p>
    <div class="answer-list">
        <input type="radio" /> 20대
        <input type="radio" /> 30대
        <input type="radio" /> 40대
        <input type="radio" /> 50대
        <input type="radio" /> 60대 이상
    </div>    
</section>

<!-- QuestionSection (02) -->
<section class="sub-section"> 
    <p class="question-title">
        <strong>Q2.</strong> 고객님의 
        <span class="highlight-blue">연소득</span>는 어떻게 되시나요?
    </p>
    <div class="answer-list">
        <input type="radio" /> 3천만원이하
        <hr class="answer-boundary">
        <input type="radio" /> 5천만원이하
        <hr class="answer-boundary">
        <input type="radio" /> 1억원이하
        <hr class="answer-boundary">
        <input type="radio" /> 3억원이하
        <hr class="answer-boundary">
        <input type="radio" /> 3억원초과
    </div>    
</section>

<!-- QuestionSection (03) -->
<section class="sub-section"> 
    <p class="question-title">
        <strong>Q3.</strong> 다음 중 고객님의 
        <span class="highlight-blue">수입원</span>을 잘 나타낸 것을 선택해주세요.
    </p>
    <div class="answer-list">
        <input type="radio" /> 현재 일정한 수입(근로소득, 사업소득, 임대소득)이 발생하고 있으며 향후 현재 수준을 유지하거나 증거할 것으로 예상
        <hr class="answer-boundary">
        <input type="radio" /> 현재 일정한 수입(연금소득)이 발생하고 있으며, 향후 현재 수준을 유지할 것으로 예상
        <hr class="answer-boundary">
        <input type="radio" /> 현재 일정한 수입이 발생하고 있으나, 향후 감소하거나 불안정할 것으로 예상
        <hr class="answer-boundary">
        <input type="radio" /> 현재 일정한 수입이 없거나 소액연금이 주 수입원임
    </div>
</section>

<!-- QuestionSection (04) -->
<section class="sub-section"> 
    <p class="question-title">
        <strong>Q4.</strong> 고객님의 
        <span class="highlight-blue">금융자산 중 투자 자금의 비중</span>을 선택해주세요.
    </p>
    <div class="answer-list">
        <input type="radio" /> 10% 이내
        <hr class="answer-boundary">
        <input type="radio" /> 30% 이내
        <hr class="answer-boundary">
        <input type="radio" /> 50% 이내
        <hr class="answer-boundary">
        <input type="radio" /> 80% 이내
        <hr class="answer-boundary">
        <input type="radio" /> 80% 초과
    </div>
</section>

<!-- QuestionSection (05) -->
<section class="sub-section"> 
    <p class="question-title">
        <strong>Q5.</strong> 다음 중 고객님의 
        <span class="highlight-blue">투자해본 금융상품</span>을 
        <span class="highlight-red">모두</span> 선택해주세요.
    </p>
    <div class="answer-list">
        <input type="checkbox" /> 은행 예적금, 국채, 지방채, 보증채, MMF, CMA 등
        <hr class="answer-boundary">
        <input type="checkbox" /> 채권형펀드, 금융채, 신용도가 높은 회사채, 원금 보장형 ELS/ELF 등
        <hr class="answer-boundary">
        <input type="checkbox" /> 혼합형 펀드, 신용도가 중간 등급인 회사채, 원금의 일부만 보장되는 ELS/ELF 등
        <hr class="answer-boundary">
        <input type="checkbox" /> 주식형 펀드, 신용도가 낮은 회사채, 원금이 보장되지 않는 ELS/ELF 등
        <hr class="answer-boundary">
        <input type="checkbox" /> 파생상품 펀드, 주식 신용거래, ELW, 선물/옵션 등
    </div>
</section>

<!-- QuestionSection (06) -->
<section class="sub-section"> 
    <p class="question-title">
        <strong>Q6.</strong>
        <span class="highlight-blue"> 파생상품, 파생결합증권(ELF, ELS) 또는 파생상품투자펀드(레버리지 펀드 등) 해당 상품에 투자한 경험</span>이 있으신가요?
    </p>
    <div class="answer-list">
        <input type="radio" /> 1년 미만(투자 경험이 없으신 경우 포함)
        <hr class="answer-boundary">
        <input type="radio" /> 1년 이상 ~ 3년 미만
        <hr class="answer-boundary">
        <input type="radio" /> 3년 이상
    </div>
</section>

<!-- QuestionSection (07) -->
<section class="sub-section"> 
    <p class="question-title">
        <strong>Q7.</strong> 고객님의 
        <span class="highlight-blue">금융투자상품에 대한 이해도</span>를 선택해주세요!
    </p>
    <div class="answer-list">
        <input type="radio" /> 매우 높음 - 파생상품을 포함한 대부분의 금융투자상품의 구조 및 위험을 이해하고 있음
        <hr class="answer-boundary">
        <input type="radio" /> 높음 - 주식, 채권, 펀드 등의 구조 및 위험을 깊이 있게 이해하고 있음
        <hr class="answer-boundary">
        <input type="radio" /> 낮음 - 주식과 채권의 차이를 구별할 수 있는 정도
        <hr class="answer-boundary">
        <input type="radio" /> 매우 낮음 - 금융상품 중 예/적금에 대해서만 알고 있는 정도
    </div>
</section>

<br><h2>II. 해당 투자자금 파악</h2><br>

<!-- QuestionSection (08) -->
<section class="sub-section"> 
    <p class="question-title">
        <strong>Q8.</strong> 고객님의 금융투자상품 가입 
        <span class="highlight-blue">목적</span>을 선택해주세요!
    </p>
    <div class="answer-list">
        <input type="radio" /> 자산 증식(여유 자금 투자)
        <hr class="answer-boundary">
        <input type="radio" /> 노후 자금 마련
        <hr class="answer-boundary">
        <input type="radio" /> 목적 자금 마련 (결혼자금, 주택구입자금 등)
        <hr class="answer-boundary">
        <input type="radio" /> 사용 예정 자금 단기 운용 (전세금, 임차보증금 등)
    </div>
</section>

<!-- QuestionSection (09) -->
<section class="sub-section"> 
    <p class="question-title">
        <strong>Q9.</strong> 고객님께서 투자하실 
        <span class="highlight-blue">자금의 예상 투자기간</span>을 선택해주세요!
    </p>
    <div class="answer-list">
        <input type="radio" /> 투자기간과 상관없이 만기일까지 보유
        <hr class="answer-boundary">
        <input type="radio" /> 3년 이상
        <hr class="answer-boundary">
        <input type="radio" /> 3년 미만
        <hr class="answer-boundary">
        <input type="radio" /> 1년 미만
        <hr class="answer-boundary">
        <input type="radio" /> 6개월 미만
    </div>
</section>

<!-- QuestionSection (10) -->
<section class="sub-section"> 
    <p class="question-title">
        <strong>Q10.</strong> 다음 중 현재 투자하는 자금에 대하여 고객님의 
        <span class="highlight-blue">기대하는 수익과 감내할 수 있는 손실</span>은 어느 정도 인가요?
    </p>
    <div class="answer-list">
        <input type="radio" /> 기대수익이 높다면 시장 상황에 따라 원금을 초과하는 손실을 감내할 수 있다.
        <hr class="answer-boundary">
        <input type="radio" /> 기대수익이 높다면 20% ~ 100%의 손실을 감내할 수 있다.
        <hr class="answer-boundary">
        <input type="radio" /> 원하는 수준의 수익을 기대할 수 있다면 20% 이내의 손실을 감내할 수 있다.
        <hr class="answer-boundary">
        <input type="radio" /> 일정 수준의 수익을 기대할 수 있다면 경미한 수준의 손실을 감내할 수 있다.
        <hr class="answer-boundary">
        <input type="radio" /> 투자원금 보전을 추구한다.
    </div>
</section>
<!-- QuestionSection (1) ~ (10) end -->

<!-- NoticeSection start -->
<h3 class="sub-title">
    <span>ℹ️</span> 알려드립니다
</h3>
<hr class="answer-boundary">
<p class="highlight-blue">본인은 투자목적, 재산상황 및 투자경험 등의 정보를 정확히 등록하였으며 다음과 같은 사항을 확인합니다.</p>
<ul class="sub-section-list">
    <li>투자성향분석결과에 따라 적합한 상품만 가입 가능해요!</li>
    <li>투자경험, 투자목적, 투자기간 및 손실 감내 수준과 관련한 설문항목 답변에 따라 ELS/ELF 등 일부 상품의 가입이 제한될 수 있어요!</li>
</ul><br><br>
<!-- NoticeSection end -->

<!-- CompleteButton -->
<button class="main-section complete-button" @click="goToNext">나의 투자성향 분석결과</button>

    <!-- 팝업(모달) -->
    <div v-if="isModalOpen" class="modal-overlay">
        <div class="modal-box">
            <h3>투자성향분석 결과 안내</h3><br>
            <p>고객님의 투자성향과 가입하고자 하는 금융투자상품의 위험 수준을 확인 후 신중하게 투자하여 주시기 바랍니다.</p>
            <br>
            <button class="modal-complete-button" @click="closeModal">확인하였습니다.</button>
        </div>
    </div>
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
    font-size: 20px;
    font-weight: 700;
    color: var(--main05);
}

/* MainSection styles */
.sub-section {
    margin-bottom: 30px;
    border: 1.5px solid var(--main04);
    border-radius: 5px;
    background-color: var(--main05);
    height: auto;
}
.question-title {
    margin: 34px 40px 34px 40px;
    font-size: 15px;
}
.answer-list {
    margin: 0px 45px 34px 45px;
    display: auto;
}
.answer-boundary {
    border: 1px solid var(--main04);
    margin: 10px 5px 10px 5px;
}


/* MainSection-List styles */
.sub-section-list {
    list-style-position: inside;
    padding: 2px 15px;
    margin: 5px;
}

.list-section {
    margin: 0px 40px 34px 40px;
    border: 1px solid var(--main03);
    border-radius: 5px;
}

/* NextButton styles */
.complete-button {
    padding: 16px 0;
    background: var(--main01);
    color: var(--white);
    font-weight: 700;
    font-size: 20px;
    display: flex;
    justify-content: center; 
    border: none;
    cursor: pointer;
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


/* Modal styles */
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
</style>

<script setup>
// imports
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// func.
const isModalOpen = ref(false)
const router = useRouter()
const goToNext = () => {
    isModalOpen.value = true
}
const closeModal = () => {
    isModalOpen.value = false
    router.push('/inv-type-results-page')
}

</script>
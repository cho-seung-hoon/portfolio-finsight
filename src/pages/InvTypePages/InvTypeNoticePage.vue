<!-- 
작성자: JY
작성일자: 2025-07-29
페이지명: 투자성향분석-전문금융소비자 안내페이지
    [경로]
        path: '/inv-type-notice-page',
        name: 'InvTypeNoticePage',
        component: InvTypeNoticePage
-->

<template>
<!-- MainSection start-->
<div class="main-section">
    <!-- SubSection_1 start -->
    <section class="sub-section-row">
        <h2 class="sub-title">전문소비자 개요</h2>
        <p class="sub-text">금융투자상품에 관한 전문성 구비, 소유자산 규모 등에 비추어 투자에 따른 위험을 감수할 수 있는 투자자로 자본시장과 금융투자업에 관한 법률에서 정한자를 말하며, 전문 금융소비자로 등록되는 경우 일반투자자에게 적용되는 적정성·적합성 설명 의무가 면제됩니다.</p>
        <small class="notice-section">* 관련 법령: 자본시장법 시행령 제10조 (전문투자자의 범위 등) 지정령 제7조</small>
    </section>
    <!-- SubSection_1 end -->
    
    <!-- SubSection_2 start -->
    <section class="sub-section-row">
        <h2 class="sub-title">전문금융소비자 등록 기준</h2>
        <p class="sub-text">아래의 기준 중 필수 기준을 충족하고 ① ~ ③ 중 하나에 해당되는 경우</p><br>
        <ul>
            <li class="sub-section-list">
                <h3 class="sub-title2">[필수 기준]</h3>
                <p class="sub-text">최근 5년 중 1년 이상의 기간 동안 금융위원회가 고시한 금융투자상품을 월평균잔고기준으로 5천만원 이상 보유</p>
            </li>
            <br>
            <li class="sub-section-list">
                <h3 class="sub-title2">[선택 기준]</h3>
                <ul>
                    <li class="sub-section-list sub-text">① 최근 5년 중 1년 이상의 기간 동안 금융위원회가 고시한 금융투자상품을 월평균잔고기준으로 5천만원 이상 보유</li>
                    <li class="sub-section-list sub-text">② 전문가 요건
                        <ul>
                            <li class="sub-section-list">(1) 회계사, 변호사, 감평사, 변리사, 세무사</li>
                            <li class="sub-section-list">(2) 투자자산운용사, 금융투자분석사, (국제)재무위험관리사</li>
                            <li class="sub-section-list">(3) (1) 또는 (2) 분야 1년 이상 종사자</li>
                        </ul>
                    </li>
                    <li class="sub-section-list sub-text">③ 자산요건: 부부합산 거주 부동산 관련 금액 제외한 순자산가액 5억원</li>
                </ul>
            </li>
        </ul>
    </section>
    <!-- SubSection_2 end -->

    <!-- SubSection_3 start -->
    <section class="sub-section-row">
        <h2 class="sub-title">전문금융소비자 등록 방법 (영업점 내점시 가능)</h2>
        <ul>
            <li class="sub-section-list sub-text">① [은행] 잔고증명서 발급</li>
            <li class="sub-section-list sub-text">② [심사기관] 전문투자자 확인증 발급<br/>
                <small class="notice-section">* KB증권 등 4개 증권사에서 발급 가능</small>
            </li>
            <li class="sub-section-list sub-text">③ [은행/증권사 등록]
                <ul>
                    <li class="sub-section-list">(1) 전문투자자 확인증 지의 확인</li>
                    <li class="sub-section-list">(2) 전문투자자 전환 등록 및 안내</li>
                </ul>
            </li>
        </ul>
    </section>
    <!-- SubSection_3 end -->

    <!-- Button Section -->
    <button
        class="complete-button"
        @click="backToPrevious"
        >위 안내사항을 확인하였습니다.
    </button> 
</div>
<!-- MainSection end-->

</template>


<style scoped>
/* Main Section Styles */
.main-section {
    padding: 32px 32px 32px 32px;
    background: var(--main05);
    width: calc(100% + 40px);
    margin-left: -20px;
    margin-right: -20px;
    margin-bottom: 0px;
}

/* Sub Section Styles */
.sub-section-row {
    margin-bottom: 24px;
}
.sub-title {
    font-size: 18px;
}
.sub-text {
    font-size: 13px;
}
.sub-title2 {
    font-size: 15px;
}
.notice-section {
    margin-top: 18px;
    font-size: var(--font-size-sm);
    color: #8c8c8c;
}
.sub-section-list {
    list-style-position: inside;
    padding: 2px 10px;
    margin:auto;
    display: block;
}

/* Button Section Styles */
.complete-button {
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
    z-index: 1000; /* 다른 요소보다 위에 오도록 */
}
</style>

<script setup>
// imports
import { useRouter } from 'vue-router'

// func.
const router = useRouter()
const backToPrevious = () => {
    router.push('/inv-type-test-step-1-page')
}
</script>
<!-- 
작성자: JY
작성일자: 2025-07-22
페이지명: 투자성향분석-1단계-페이지
    [경로]
    path: '/inv-type-test-step-1-page',
    name: 'InvTypeTestStep1Page',
    component: InvTypeTestStep1Page
-->
<template>
<div class="container">
    <div>
        <h1 class="title">투자성향분석</h1><hr>
    </div>
    <div>
        <br><br>
        <section class="section">
            <h2 class="sub-title">고객님의 금융소비자 유형을 선택해주세요.</h2><br>
            <div class="button-group">
                <button :class="['button', { active: consumerType === '일반' }]" @click="consumerType = '일반'">일반금융소비자</button>
                <button :class="['button', { active: consumerType === '전문' }]" @click="consumerType = '전문'">전문금융소비자<br>(영업점가입대상)</button>
            </div>
            <div class="guide-link" @click="goToNotion">전문금융소비자 안내 &gt;</div>
        </section><hr class="section-boundary"><br>
        <section class="section">
            <h2 class="sub-title">다음의 금융취약소비자에 해당하십니까?</h2><br>
            <ul class="sub-section">
                    <li class="sub-section-list">고령자(만 65세 이상)</li>
                    <li class="sub-section-list">은퇴자 또는 주부</li>
                    <li class="sub-section-list">금융투자상품 가입시 유의사항 안내가 필요한 분</li>
            </ul>
            <div class="button-group">
                <button :class="['button', { active: isVulnerable === false }]" @click="isVulnerable = false">아니오</button>
                <button :class="['button', { active: isVulnerable === true }]" @click="isVulnerable = true">예</button>
            </div>
        </section><hr class="section-boundary"><br>
        <section class="section">
            <h2 class="sub-title"><span class="bule-highlight">최근 1개월</span> 이내 대출을 받았거나, <br><span class="bule-highlight">앞으로 1개월 이내</span> 대출을 받을 예정인가요?</h2>
            <div class="button-group">
                <button :class="['button', { active: hasLoan === false }]" @click="hasLoan = false">아니오</button>
                <button :class="['button', { active: hasLoan === true }]" @click="hasLoan = true">예</button>
            </div>
        </section>
    </div>
    <div>
        <button class="next-button" @click="goToNext">다음으로</button>
    </div>
</div>
</template>

<script setup>
// imports
import { useRouter } from 'vue-router'

// func.
const router = useRouter()
const goToNotion = () => {
    router.push('/inv-type-notice-page')
}
const goToNext = () => {
    router.push('/inv-type-test-step-2-page')
}
</script>

<style scoped>

.container {
    margin: 0 auto;
    padding: 24px;
    font-family: sans-serif;
    background-color: var(--main05);
}
.title {
    color: black;
    display: flex;
    font-size: var(--font-size-xl);
    background-color: var(--main05);
}
.sub-title{
    color: black;
    font-size: var(--font-size-xl);
}
.section {
    margin-bottom: 30px;
    margin-left: 30px;
    margin-right: 30px;
}
.sub-section {
    margin-bottom: 30px;
    border: 3px solid var(--main03);
    border-radius: 5px;
    background-color: var(--main05);
    height: auto;
}
.sub-section-list {
    margin-right: 60px;
    list-style-position: inside;
    padding: 2px 15px;
}
.section-boundary {
border: none;
border-top: 2px solid var(--main03);
margin-right: 30px;
margin-left: 30px;
}
.button-group {
    height: auto;
    display: flex;
    width: 400px;
    overflow: hidden;
    margin-top: 8px;
}
.button {
    border: 3px solid var(--main03);
    border-radius: 5px;
    width: 400px;
    font-family: sans-serif;
    font-weight: bold;
    font-size: var(--font-size-lg);
    color: #8c8c8c;
    background-color: var(--main05);
    cursor: pointer;
}
.button-group button:hover {
    color: var(--sub01);
    border: 3px solid var(--sub01);
}
.guide-link {
    margin-top: 8px;
    margin-right: 30px;
    text-align: right;
    font-size: var(--font-size-md);
    color: #8c8c8c;
    cursor: pointer;
}
.bule-highlight {
    color: var(--text-blue);
}
.next-button {
    width: 100%;
    padding: 12px 0;
    border: none;
    color: #fcfcfc;
    background-color: var(--main01);
    border-radius: 8px;
    font-weight: bold;
    font-size: var(--font-size-xl);
    cursor: pointer;
}


</style>
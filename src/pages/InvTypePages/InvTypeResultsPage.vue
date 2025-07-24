<!-- 
작성자: JY
작성일자: 2025-07-22
페이지명: 투자성향분석-결과-페이지
    [경로]
    path: '/inv-type-results-page',
    name: 'InvTypeResultsPage',
    component: InvTypeResultsPage
-->

<template>
<div class="container">
    <div>
        <h1 class="title">투자성향분석</h1><br><hr>
    </div>


    <div>
        <div>
            <img src="#" alt="warning-icon" />
            <span>본 상품은 일반 예금상품과 달리 원금의 일부 또는 전부 손실이 발생할 수 있으며, 투자로 인한 손실은 투자자 본인에게 귀속됩니다.</span>
        </div><br>
        <div>
            <p class="sub-title">
                <strong>{{ name }}</strong>님의 투자 성향은<br>
                <strong class="blue-highlight">{{ invest_type }}</strong>이며,<br>
                <strong class="blue-highlight">{{ invest_type_description }}</strong><br>
                상품에 가입할 수 있어요.
            </p>

        </div><br>
        
        <div>
            그래프 입니다.
        </div><br>
        <p><button class="notice-button" @click="goToPortfolio">적합상품 등급 안내</button></p><br>
        <p><button class="next-button" @click="goToMain">확인</button></p>
        
    </div>



</div>
</template>

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
.blue-highlight {
    color: var(--text-blue);
}


</style>

<script setup>
// imports
import { useRouter } from 'vue-router'
import { ref } from 'vue'

// func.
const name = ref('이진욱')
const invest_type = ref('안정형')
const invest_type_description = ref('원금 손실 가능성이 낮은 안정형')
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
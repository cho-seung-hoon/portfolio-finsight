<template>
  <div class="subBox">
    <div class="subTitle">펀드, ETF 평가액</div>
    <div class="valuation">210,000원</div>
    <div class="calc">1.30 -0.09%</div>
    <img
      src="@/assets/cha2.png"
      alt="Bear" />
    <div class="phraseBox">
      <div class="phrase">핀사이트에 가입하고 난 후의 평가액입니다!</div>
    </div>
  </div>
</template>

<script setup></script>
<style scoped>
.subBox {
  width: 100%;
  padding: 20px;
  background-color: var(--white);
  position: relative;
  border-radius: 8px;
  border: 1px solid var(--main04);
}

.subTitle {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-regular);
  color: var(--main02);
  margin-bottom: 12px;
}

.valuation {
  font-size: var(--font-size-xxl);
  font-weight: var(--font-weight-bold);
}

.calc {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-light);
}

.phraseBox {
  position: relative;
  background-color: var(--main01);
  padding: 15px;
  margin-top: 20px;
  border-radius: 16px;
  z-index: 2;
  overflow: visible; /* 캐릭터가 튀어나올 수 있게 */
}

img {
  position: absolute;
  bottom: 25px;
  right: 20px;
  width: 100px;
}

.phrase {
  color: var(--white);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-light);
}
</style>

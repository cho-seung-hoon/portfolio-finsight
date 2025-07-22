<template>
  <section class="etf-item-container">
    <section class="etf-item-header-section">
      <div class="etf-item-sub-title">주식형</div>
      <header class="etf-item-header">
        ETF 아이템
        <IconHeartStroke></IconHeartStroke>
      </header>
    </section>
    <section class="etf-item-content-section">
      <div class="info-row">
        <span class="label">기준가</span>
        <span class="value">2000</span>
      </div>
      <div class="info-row">
        <span class="label">거래량</span>
        <span class="value">3000</span>
      </div>
      <div class="info-row">
        <span class="label">수익률</span>
        <span class="value">3.3% (1개월)</span>
      </div>
      <div class="info-row">
        <span class="label">위험등급</span>
        <span class="value">3등급</span>
      </div>
      <div class="info-row">
        <span class="label">뉴스</span>
        <span class="value">긍정</span>
      </div>
    </section>
  </section>
</template>

<script setup>
import IconHeartStroke from '../icons/IconHeartStroke.vue';
</script>

<style scoped>
.etf-item-container {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  border-radius: 12px;
  border: 1px solid var(--main04);
  background-color: var(--white);
  padding: 20px 28px;
  gap: 12px;
}

.etf-item-header-section {
  display: flex;
  flex-direction: column;
}

.etf-item-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semi-bold);
  color: var(--main01);
}

.etf-item-sub-title {
  display: flex;
  font-size: var(--font-size-ms);
  font-weight: var(--font-weight-regular);
  color: var(--main02);
}

.etf-item-content-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.label {
  width: 80px;
  font-size: var(--font-size-ms);
  font-weight: var(--font-weight-regular);
  color: var(--main01);
  flex-shrink: 0;
}

.value {
  font-size: 20px;
  font-size: var(--font-size-ms);
  font-weight: var(--font-weight-regular);
  color: var(--main01);
}
</style>

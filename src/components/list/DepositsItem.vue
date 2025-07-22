<template>
  <section class="deposits-item-container">
    <section class="deposits-item-header-section">
      <header class="deposits-item-header">
        예금 아이템
        <IconHeartStroke></IconHeartStroke>
      </header>
      <div class="deposits-item-sub-title">수협은행</div>
    </section>
    <section class="deposits-item-content-section">
      <span>기간: 1년</span>
      <span>최고 2.80%, 기본 1.2%</span>
    </section>
  </section>
</template>

<script setup>
import IconHeartStroke from '../icons/IconHeartStroke.vue';
</script>

<style scoped>
.deposits-item-container {
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

.deposits-item-header-section {
  display: flex;
  flex-direction: column;
}

.deposits-item-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semi-bold);
  color: var(--main01);
}

.deposits-item-sub-title {
  display: flex;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-regular);
  color: var(--main02);
}

.deposits-item-content-section {
  display: flex;
  flex-direction: column;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-regular);
  color: var(--main01);
}
</style>

<template>
  <div class="deposit-status">
    <DetailProductHeader
      title="내 예금 상품 현황"
      @back="goBack" />
    <DetailProductInfo
      title="SH 첫만남우대예금"
      bank="SH 수협은행"
      name="SH 첫만남우대예금" />
    <div class="account-details">
      <div class="detail-row">
        <span class="detail-label">예금 계결일</span>
        <span class="detail-value">2024.08.20</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">예금 만료일</span>
        <span class="detail-value">2025.08.20</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">예금액</span>
        <span class="detail-value amount">100,000원</span>
      </div>
    </div>
    <div class="action-section">
      <button
        class="cancel-button"
        @click="handleCancel">
        해지하기
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineComponent } from 'vue';

// DetailProductHeader 컴포넌트
const DetailProductHeader = defineComponent({
  props: {
    title: String
  },
  emits: ['back'],
  template: `
    <div class="sell-header">
      <span class="chevron-left" @click="$emit('back')">&#60;</span>
      <span class="header-title">{{ title }}</span>
    </div>
  `
});

// DetailProductInfo 컴포넌트
const DetailProductInfo = defineComponent({
  props: {
    title: String,
    bank: String,
    name: String
  },
  template: `
    <div class="buy-info-card">
      <div class="buy-product-title">
        <div class="bank-info">
          <div class="bank-icon"></div>
          <div class="bank-text">{{ bank }}</div>
        </div>
        <div class="product-name">{{ title }}</div>
      </div>
      <div class="info-row" v-if="name">
        <span class="info-name">{{ name }}</span>
        <span class="info-detail-page">
          <button class="detail-button">상세</button>
        </span>
      </div>
    </div>
  `
});

function goBack() {
  // 뒤로가기 로직
  console.log('뒤로가기');
}

function handleCancel() {
  // 해지하기 로직
  console.log('해지하기');
}
</script>

<style scoped>
:root {
  --white: #ffffff;
  --main01: #2c3e50;
  --main02: #7f8c8d;
  --main04: #ecf0f1;
  --main05: #ffffff;
  --font-size-md: 16px;
  --font-size-xl: 20px;
  --font-weight-bold: 700;
}

.deposit-status {
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* Header Styles */
.sell-header {
  display: flex;
  align-items: center;
  height: 56px;
  background: var(--white);
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid var(--main04);
  padding: 0 16px;
  margin-bottom: 24px;
}

.chevron-left {
  font-size: 24px;
  color: var(--main01);
  margin-right: 16px;
  cursor: pointer;
}

.header-title {
  flex: 1;
  text-align: center;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  color: var(--main01);
}

/* Product Info Card Styles */
.buy-info-card {
  background: #334155;
  border-radius: 16px;
  padding: 24px;
  margin: 0 20px 24px 20px;
  color: white;
}

.buy-product-title {
  margin-bottom: 16px;
}

.bank-info {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.bank-icon {
  width: 32px;
  height: 32px;
  background-color: #64748b;
  border-radius: 50%;
  margin-right: 12px;
}

.bank-text {
  font-size: 14px;
  color: #cbd5e1;
}

.product-name {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--main05);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-button {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.detail-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Account Details Styles */
.account-details {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin: 0 20px 32px 20px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f1f5f9;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  color: #64748b;
  font-size: 16px;
}

.detail-value {
  color: #1e293b;
  font-weight: 600;
  font-size: 16px;
}

.detail-value.amount {
  font-weight: 700;
  font-size: 18px;
}

/* Action Section Styles */
.action-section {
  padding: 0 20px;
}

.cancel-button {
  width: 100%;
  padding: 16px;
  background: transparent;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  color: #6b7280;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-button:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}
</style>

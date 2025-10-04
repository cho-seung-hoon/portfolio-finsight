<template>
  <div class="buy-info-card">
    <div class="buy-product-title">
      <div class="bank-section">
        <div class="bank-icon"></div>
        <div class="bank-info">
          <div
            v-if="bank"
            class="buy-product-bank">
            {{ bank }}
          </div>
          <div class="product-title">{{ title }}</div>
        </div>
      </div>
    </div>

    <div
      v-if="name"
      class="info-row">
      <span class="info-name">{{ name }}</span>
      <span class="info-detail-page">
        <button
          class="detail-button"
          @click="$emit('detail')">
          상세
        </button>
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  bank: String,
  name: String
});

defineEmits(['detail']);
</script>

<style scoped>
:root {
  --main01: #2c3e50;
  --main02: #7f8c8d;
  --main05: #ffffff;
  --font-size-md: 16px;
  --font-size-xl: 20px;
  --font-weight-bold: 700;
}

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

.bank-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bank-icon {
  width: 40px;
  height: 40px;
  background-color: #64748b;
  border-radius: 50%;
  flex-shrink: 0;
  position: relative;
}

.bank-icon::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background-color: #94a3b8;
  border-radius: 50%;
}

.bank-info {
  flex: 1;
}

.buy-product-bank {
  font-size: 14px;
  color: #cbd5e1;
  margin-bottom: 4px;
}

.product-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--main05);
  line-height: 1.3;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-name {
  color: var(--main05);
  font-size: var(--font-size-md);
}

.detail-button {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.detail-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.detail-button:active {
  transform: translateY(0);
}
</style>

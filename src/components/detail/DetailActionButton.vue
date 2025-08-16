<template>
  <div class="asset-record-btn-fixed-wrapper">
    <button
      v-if="!hasValidHoldings"
      type="button"
      class="asset-record-btn-fixed"
      @click="handleBuyClick">
      <span class="asset-record-btn-text center">{{ getBuyButtonText() }}</span>
    </button>

    <div
      v-else
      class="holding-buttons">
      <button
        v-if="canSell"
        type="button"
        class="asset-record-btn-fixed sell-btn"
        @click="handleSellClick">
        <span class="asset-record-btn-text">{{ getSellButtonText() }}</span>
      </button>
      <button
        v-if="category !== 'deposit'"
        type="button"
        class="asset-record-btn-fixed buy-btn"
        @click="handleBuyClick">
        <span class="asset-record-btn-text">{{ getAdditionalBuyButtonText() }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  productInfo: Object,
  bank: String,
  title: String,
  maxRate: String,
  maxRateDesc: String,
  baseRate: String,
  active: Boolean,
  category: String,
  id: [String, Number]
});

const emit = defineEmits(['buy-click', 'sell-click']);

const isHolding = computed(() => {
  return props.productInfo?.isHolding || props.active || false;
});

const hasValidHoldings = computed(() => {
  if (!isHolding.value) return false;
  
  const holdingsTotalQuantity = 
    props.productInfo?.holdingsTotalQuantity ||
    props.productInfo?.holdings?.holdingsTotalQuantity ||
    0;
  
  const holdingsStatus = props.productInfo?.holdings?.holdingsStatus;
  
  return holdingsTotalQuantity > 0 && holdingsStatus !== 'zero';
});

const category = computed(() => {
  return props.productInfo?.category || props.category || 'etf';
});

const productId = computed(() => {
  return props.productInfo?.productCode || props.id;
});

const canSell = computed(() => {
  if (category.value === 'deposit') {
    return hasValidHoldings.value;
  }
  
  const holdingsTotalQuantity =
    props.productInfo?.holdingsTotalQuantity ||
    props.productInfo?.holdings?.holdingsTotalQuantity ||
    0;
  return holdingsTotalQuantity > 0;
});

const heartActive = ref(false);
function toggleHeart() {
  heartActive.value = !heartActive.value;
}

function handleBuyClick() {
  emit('buy-click', {
    category: category.value,
    id: productId.value,
    productInfo: props.productInfo
  });
}

function handleSellClick() {
  emit('sell-click', {
    category: category.value,
    id: productId.value,
    productInfo: props.productInfo
  });
}

function getBuyButtonText() {
  if (category.value === 'deposit') {
    return '가입하기';
  }
  return '구매하기';
}

function getSellButtonText() {
  if (category.value === 'deposit') {
    return '해지하기';
  }
  return '판매하기';
}

function getAdditionalBuyButtonText() {
  if (category.value === 'deposit') {
    return '가입하기';
  }
  return '구매하기';
}
</script>

<style scoped>
.asset-record-btn-fixed-wrapper {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 30px;
  width: 100%;
  max-width: 408px;
  z-index: 900;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.asset-record-btn-fixed {
  width: 100%;
  border-radius: 20px;
  padding: 16px 0;
  background: var(--main01);
  color: var(--white);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-lg);
  transition: background 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 56px;
  box-sizing: border-box;
  border: none;
}
.holding-buttons {
  display: flex;
  gap: 12px;
  width: 100%;
}

.holding-buttons .asset-record-btn-fixed {
  flex: 1;
  min-height: 56px;
}

.sell-btn {
  background: var(--sub01);
  color: var(--white);
}

.buy-btn {
  background: var(--main01);
  color: var(--white);
}
.asset-record-btn-text {
  text-align: center;
}
.asset-record-btn-text.center {
  margin-top: 0;
}
@media (max-width: 480px) {
  .asset-record-btn-fixed-wrapper {
    width: calc(100% - 32px);
    margin-left: 0;
    margin-right: 0;
    left: 50%;
    transform: translateX(-50%);
    max-width: 100vw;
  }
}
</style>

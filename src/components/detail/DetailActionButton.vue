<template>
  <div class="asset-record-btn-fixed-wrapper">
    <!-- 보유하지 않은 상품일 때 -->
    <button
      v-if="!isHolding"
      type="button"
      class="asset-record-btn-fixed"
      @click="handleBuyClick">
      <span class="asset-record-btn-text center">{{ getBuyButtonText() }}</span>
    </button>

    <!-- 보유 중인 상품일 때 -->
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
  productInfo: Object, // 새로운 구조: productInfo 객체
  // 기존 개별 props (하위 호환성을 위해 유지)
  bank: String,
  title: String,
  maxRate: String,
  maxRateDesc: String,
  baseRate: String,
  active: Boolean, // isHolding 값을 받는 prop
  category: String,
  id: [String, Number]
});

const emit = defineEmits(['buy-click', 'sell-click']);

// productInfo에서 데이터 추출
const isHolding = computed(() => {
  return props.productInfo?.isHolding || props.active || false;
});

const category = computed(() => {
  return props.productInfo?.category || props.category || 'etf';
});

const productId = computed(() => {
  return props.productInfo?.productCode || props.id;
});

// 판매 가능 여부 (보유 수량이 0보다 클 때만)
const canSell = computed(() => {
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
  // 구매하기 버튼 클릭 시 이벤트 emit
  emit('buy-click', {
    category: category.value,
    id: productId.value,
    productInfo: props.productInfo
  });
}

function handleSellClick() {
  // 판매하기/해지하기 버튼 클릭 시 이벤트 emit
  emit('sell-click', {
    category: category.value,
    id: productId.value,
    productInfo: props.productInfo
  });
}

// 첫 구매/가입 버튼 텍스트 반환
function getBuyButtonText() {
  if (category.value === 'deposit') {
    return '가입하기';
  }
  return '구매하기';
}

// 구매/해지 버튼 텍스트 반환
function getSellButtonText() {
  if (category.value === 'deposit') {
    return '해지하기';
  }
  return '판매하기';
}

// 구매 버튼 텍스트 반환
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
  z-index: 900; /* 모달 배경 뒤에 위치하도록 수정 */
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
  font-weight: 700;
  font-size: 18px;
  transition: background 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* 수직 중앙 정렬 */
  min-height: 56px; /* 버튼 높이 최소값(원하는 값으로 조정) */
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
    width: calc(100% - 32px); /* 좌우 16px 여백 */
    margin-left: 0;
    margin-right: 0;
    left: 50%;
    transform: translateX(-50%);
    max-width: 100vw;
  }
}
</style>

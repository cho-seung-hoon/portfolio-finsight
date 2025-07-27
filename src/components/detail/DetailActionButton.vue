<template>
  <div class="asset-record-btn-fixed-wrapper">
    <!-- 보유하지 않은 상품일 때 -->
    <button
      v-if="!active"
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
import { ref } from 'vue';

const props = defineProps({
  bank: String,
  title: String,
  maxRate: String,
  maxRateDesc: String,
  baseRate: String,
  active: Boolean, // isHolding 값을 받는 prop
  category: String,
  id: [String, Number]
});

const emit = defineEmits(['buy', 'sell']);

const heartActive = ref(false);
function toggleHeart() {
  heartActive.value = !heartActive.value;
}

function handleBuyClick() {
  // 첫 매수하기 또는 추가 매수하기 버튼 클릭 시 이벤트 emit
  emit('buy', {
    category: props.category,
    id: props.id
  });
}

function handleSellClick() {
  // 매도하기/해지하기 버튼 클릭 시 이벤트 emit
  emit('sell', {
    category: props.category,
    id: props.id
  });
}

// 첫 매수/가입 버튼 텍스트 반환
function getBuyButtonText() {
  if (props.category === 'deposit') {
    return '상품 가입하기';
  }
  return '첫 매수하기';
}

// 매도/해지 버튼 텍스트 반환
function getSellButtonText() {
  if (props.category === 'deposit') {
    return '해지하기';
  }
  return '매도하기';
}

// 추가 매수 버튼 텍스트 반환
function getAdditionalBuyButtonText() {
  if (props.category === 'deposit') {
    return '추가 가입하기';
  }
  return '추가 매수하기';
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

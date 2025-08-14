<template>
  <div class="subBox">
    <div class="subTitle">펀드, ETF 평가액</div>
    <div class="valuation">{{ formatCurrency(totalValuation) }}원</div>
    <div class="calc">
      <span class="change-amount" :class="getChangeClass()">
        {{ formatChangeAmount() }}
      </span>
      <span class="change-percent" :class="getChangeClass()">
        ({{ formatChangePercent() }})
      </span>
    </div>
    <img
      src="@/assets/cha2.png"
      alt="Bear" />
    <div class="phraseBox">
      <div class="phrase">{{ message }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// Props 정의
const props = defineProps({
  totalValuation: {
    type: Number,
    default: 0
  },
  message: {
    type: String,
    default: '핀사이트에 가입하고 난 후의 평가액입니다!'
  },
  change: {
    type: Number,
    default: 0
  },
  changePercent: {
    type: Number,
    default: 0
  }
});

// 전일대비 금액 포맷팅 (화살표 포함)
const formatChangeAmount = () => {
  if (props.change === 0) return '─ 0원';
  const sign = props.change > 0 ? '▲' : '▼';
  const amount = new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(Math.abs(props.change));
  return `${sign} ${amount}원`;
};

// 전일대비 퍼센트 포맷팅
const formatChangePercent = () => {
  if (props.change === 0) return '0.00%';
  const sign = props.change > 0 ? '+' : '';
  return `${sign}${props.changePercent.toFixed(2)}%`;
};

// 변화에 따른 클래스 반환
const getChangeClass = () => {
  if (props.change === 0) return 'neutral';
  return props.change > 0 ? 'positive' : 'negative';
};

// 통화 포맷팅 함수 (소수점 포함)
const formatCurrency = (value) => {
  if (!value) return '0';
  return new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value);
};
</script>
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
  display: flex;
  gap: 8px;
  align-items: center;
}

.change-amount {
  font-weight: var(--font-weight-medium);
}

.change-percent {
  font-weight: var(--font-weight-light);
}

.positive {
  color: #dc2626;
}

.negative {
  color: #2563eb;
}

.neutral {
  color: var(--main02);
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

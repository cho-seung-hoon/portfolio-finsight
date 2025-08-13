<template>
  <section
    class="fund-item-container"
    @click="goToDetail">
    <section class="fund-item-header-section">
      <div class="fund-item-sub-title">
        {{ countryLabelMap[item.productCountry] ?? item.productCountry }}
        ・
        {{ typeLabelMap[item.productType] ?? item.productType }}
      </div>

      <header class="fund-item-header">
        <div class="fund-item-title-left">
          <span class="product-name">{{ item.productName }}</span>
          <span
            v-if="item.userOwns"
            class="own-tag"
            >보유중</span
          >
        </div>
        <IconHeartStroke class="heart-icon" />
      </header>

      <div
        v-if="item.isPopularInUserGroup"
        class="user-group-popular-badge">
        안정추구형 HOT
      </div>
    </section>

    <section class="fund-item-content-section">
      <div class="info-row">
        <span class="label">수익률(3개월)</span>
        <span
          class="value"
          :class="changeClass">
          {{
            item.productRateOfReturn != null && item.productRateOfReturn !== ''
              ? item.productRateOfReturn + '%'
              : '-'
          }}
        </span>
      </div>
      <div class="info-row">
        <span class="label">펀드규모</span>
        <span class="value">{{ fmtNumber(item.fundScale) }}억원</span>
      </div>
      <div class="info-row">
        <span class="label">위험등급</span>
        <span class="value">{{ item.productRiskGrade }}등급</span>
      </div>

      <div
        v-if="item.newsSentiment"
        class="news-response-box">
        <span class="news-label">뉴스반응</span>
        <div class="news-bar-wrapper">
          <div
            v-for="(key, index) in ['positive', 'neutral', 'negative']"
            :key="key"
            class="news-bar-segment"
            :class="{
              left: index === 0,
              center: index === 1,
              right: index === 2
            }"
            :style="getSegmentStyle(key)" />
        </div>
      </div>
    </section>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import IconHeartStroke from '../icons/IconHeartStroke.vue';

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

const countryLabelMap = {
  domestic: '국내',
  foreign: '해외'
};
const typeLabelMap = {
  equity: '주식형',
  bond: '채권형',
  mixed: '혼합형'
};
const colorMap = {
  positive: 'var(--newsPositive)',
  neutral: 'var(--newsNeutral)',
  negative: 'var(--newsNegative)'
};

const router = useRouter();

function goToDetail() {
  router.push(`/fund/${props.item.productCode}`);
}

function getSegmentStyle(key) {
  const values = props.item.newsSentiment || { positive: 0, neutral: 0, negative: 0 };
  const total = Object.values(values).reduce((sum, v) => sum + v, 0) || 1;
  const maxKey = Object.keys(values).reduce((a, b) => (values[a] > values[b] ? a : b));

  return {
    width: `${(values[key] / total) * 100}%`,
    height: '100%',
    backgroundColor: key === maxKey ? colorMap[key] : 'var(--main04)',
    marginRight: key !== 'negative' ? '3px' : '0'
  };
}

const changeClass = computed(() => {
  const raw = props.item?.productRateOfReturn;
  const v = Number(raw);
  if (raw == null || raw === '' || Number.isNaN(v)) return '';
  if (v > 0) return 'up';
  if (v < 0) return 'down';
  return 'flat';
});

function fmtNumber(n) {
  if (n == null || n === '') return '-';
  const num = Number(n);
  if (Number.isNaN(num)) return '-';
  return num.toLocaleString('ko-KR');
}
</script>

<style scoped>
@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fund-item-container {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  border-radius: 12px;
  border: 1px solid var(--main04);
  background-color: var(--white);
  padding: 20px 28px;
  gap: 12px;
  cursor: pointer;
  animation: fadeSlideIn 0.6s ease;
  transition: transform 0.2s ease;
}

.fund-item-container:active {
  transform: scale(0.98);
  background-color: var(--main04);
}

.fund-item-header-section {
  display: flex;
  flex-direction: column;
}

.fund-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semi-bold);
  color: var(--main01);
}

.fund-item-title-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1 1 auto;
  min-width: 0;
}

.product-name {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
  max-width: 100%;
}

.heart-icon {
  flex: 0 0 24px;
  width: 24px;
  height: 24px;
}

.fund-item-header svg:hover {
  transform: none;
}

.own-tag {
  background-color: var(--main04);
  color: var(--main02);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  padding: 2px 4px;
  border-radius: 4px;
}

.fund-item-sub-title {
  display: flex;
  font-size: var(--font-size-ms);
  font-weight: var(--font-weight-regular);
  color: var(--main02);
}

.user-group-popular-badge {
  margin-top: 4px;
  font-size: var(--font-size-ms);
  font-weight: var(--font-weight-medium);
  color: var(--green01);
}

.fund-item-content-section {
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
  width: 120px;
  font-size: var(--font-size-ms);
  font-weight: var(--font-weight-regular);
  color: var(--main02);
  flex-shrink: 0;
}

.value {
  font-size: var(--font-size-ms);
  font-weight: var(--font-weight-regular);
  color: var(--main01);
}

.value.up {
  color: var(--text-red);
  font-weight: var(--font-weight-medium);
}
.value.down {
  color: var(--text-blue);
  font-weight: var(--font-weight-medium);
}
.value.flat {
  color: var(--main01);
}

.news-response-box {
  display: flex;
  flex-direction: row;
  width: 200px;
  align-items: center;
  background-color: var(--main05);
  padding: 8px;
  margin-top: 12px;
  border: 1px solid var(--main04);
  border-radius: 12px;
  justify-content: space-between;
  margin-left: auto;
}

.news-label {
  font-size: var(--font-size-sm);
  color: var(--main02);
}

.news-bar-wrapper {
  display: flex;
  flex-direction: row;
  width: 120px;
  height: 16px;
  border-radius: 4px;
  overflow: hidden;
  margin-left: 8px;
}

.news-bar-segment {
  transition: background-color 0.3s ease-in-out;
}

.news-bar-segment.left {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

.news-bar-segment.right {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

.news-bar-segment.center {
  border-radius: 0;
}
</style>

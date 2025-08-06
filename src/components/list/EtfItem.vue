<template>
  <section
    class="etf-item-container"
    @click="goToDetail">
    <section class="etf-item-header-section">
      <div class="etf-item-sub-title">{{ item.country }} ・ {{ item.etf_type }}</div>
      <header class="etf-item-header">
        <div class="etf-item-title-left">
          {{ item.product_name }}
          <span
            v-if="item.userOwns"
            class="own-tag">
            보유중
          </span>
        </div>
        <IconHeartStroke />
      </header>
      <div
        v-if="item.isPopularInUserGroup"
        class="user-group-popular-badge">
        안정추구형 HOT
      </div>
    </section>
    <section class="etf-item-content-section">
      <div class="info-row">
        <span class="label">기준가</span>
        <span class="value">{{ item.nav.toLocaleString() }}</span>
      </div>
      <div class="info-row">
        <span class="label">거래량</span>
        <span class="value">{{ item.volume.toLocaleString() }}</span>
      </div>
      <div class="info-row">
        <span class="label">수익률</span>
        <span class="value">{{ item.rate_of_return }}</span>
      </div>
      <div class="info-row">
        <span class="label">위험등급</span>
        <span class="value">{{ item.risk_grade }}등급</span>
      </div>
      <div class="news-response-box">
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
            :style="getSegmentStyle(key)"></div>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router';
import IconHeartStroke from '../icons/IconHeartStroke.vue';

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

const router = useRouter();

function goToDetail() {
  router.push(`/etf/${props.item.product_code}`);
}

const colorMap = {
  positive: 'var(--newsPositive)',
  neutral: 'var(--newsNeutral)',
  negative: 'var(--newsNegative)'
};

function getSegmentStyle(key) {
  const values = props.item.news_response;
  const total = Object.values(values).reduce((sum, v) => sum + v, 0);
  const maxKey = Object.keys(values).reduce((a, b) => (values[a] > values[b] ? a : b));

  return {
    width: `${(values[key] / total) * 100}%`,
    height: '100%',
    backgroundColor: key === maxKey ? colorMap[key] : 'var(--main04)',
    marginRight: key !== 'negative' ? '3px' : '0'
  };
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
  cursor: pointer;
  animation: fadeSlideIn 0.6s ease;
  transition: transform 0.2s ease;
}

.etf-item-container:active {
  transform: scale(0.98);
  background-color: var(--main04);
}

.etf-item-header-section {
  display: flex;
  flex-direction: column;
}

.etf-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semi-bold);
  color: var(--main01);
}

.etf-item-title-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.own-tag {
  background-color: var(--main04);
  color: var(--main02);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  padding: 2px 4px;
  border-radius: 4px;
}

.etf-item-sub-title {
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
  font-size: var(--font-size-ms);
  font-weight: var(--font-weight-regular);
  color: var(--main01);
}

.news-response-box {
  display: flex;
  flex-direction: row;
  width: 200px;
  align-items: center;
  background-color: var(--main05);
  padding: 8px;
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

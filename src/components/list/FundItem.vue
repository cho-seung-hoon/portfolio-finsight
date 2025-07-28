<template>
  <section
    class="fund-item-container"
    @click="goToDetail">
    <section class="fund-item-header-section">
      <div class="fund-item-sub-title">{{ item.country }} ・ {{ item.fund_type }}</div>
      <header class="fund-item-header">
        <div class="fund-item-title-left">
          {{ item.product_name }}
          <span
            v-if="item.userOwns"
            class="own-tag">
            보유중
          </span>
        </div>
        <IconHeartStroke />
      </header>
    </section>
    <section class="fund-item-content-section">
      <div class="info-row">
        <span class="label">수익률</span>
        <span class="value">{{ item.rate_of_return }} (3개월)</span>
      </div>
      <div class="info-row">
        <span class="label">펀드규모</span>
        <span class="value">{{ item.scale }}</span>
      </div>
      <div class="info-row">
        <span class="label">위험등급</span>
        <span class="value">{{ item.risk_grade }}</span>
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
import { defineProps } from 'vue';
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
  router.push(`/fund/${props.item.product_code}`);
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

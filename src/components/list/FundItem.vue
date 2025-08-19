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

      <div class="fund-item-title">
        <div class="fund-item-title-left">
          <span class="product-name">{{ item.productName }}</span>
          <span
            v-if="item.userOwns"
            class="own-tag"
            >보유중</span
          >
        </div>
        <HeartToggle
          :product-code="item.productCode"
          category="fund"
          :user-watches="item.userWatches || false"
          @click.stop />
      </div>

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
        v-if="item.newsSentiment || recommended"
        class="news-row"
        @click.stop>
        <!-- 왼쪽: 추천 툴팁 아이콘 (오직 Top일 때만) -->
        <div
          v-if="recommended"
          class="etf-reco-item">
          <div
            class="icon-wrapper icon-question"
            @click.stop="showRecoTip = !showRecoTip">
            <IconQuestion />
            <Transition name="tooltip">
              <div
                v-if="showRecoTip"
                class="tooltip-content">
                최근 본 뉴스를 기반으로 추천합니다
              </div>
            </Transition>
          </div>
        </div>

        <!-- 오른쪽: 뉴스 반응 박스 (뉴스가 있을 때만) -->
        <div
          v-if="item.newsSentiment"
          class="news-response-box">
          <span class="news-label">뉴스반응</span>
          <div class="news-bar-wrapper">
            <div
              v-for="(key, index) in ['positive', 'neutral', 'negative']"
              :key="key"
              class="news-bar-segment"
              :class="{ left: index === 0, center: index === 1, right: index === 2 }"
              :style="getSegmentStyle(key)"></div>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import HeartToggle from '../common/HeartToggle.vue';
import IconQuestion from '@/components/icons/IconQuestion.vue';

const props = defineProps({
  item: { type: Object, required: true },
  recommended: { type: Boolean, default: false }
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
const showRecoTip = ref(false);

// 카드 바깥 클릭 시 닫힘
const onDocClick = () => (showRecoTip.value = false);
document.addEventListener('click', onDocClick);
onBeforeUnmount(() => document.removeEventListener('click', onDocClick));

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

.fund-item-title {
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
  align-items: center;
  gap: 6px;
}

.user-group-popular-badge {
  margin-top: 4px;
  font-size: var(--font-size-ms);
  font-weight: var(--font-weight-medium);
  color: var(--green01);
}

/* --- 아이콘 & 툴팁 --- */
.etf-reco-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  position: relative;
}

.icon-wrapper {
  cursor: pointer;
  width: 20px;
  height: 20px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-question {
  color: var(--main02);
}

/* 툴팁 */
.tooltip-content {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  transform: none;
  width: max-content;
  max-width: 260px;
  padding: 10px 12px;
  white-space: normal;
  word-break: keep-all;
  border-radius: 10px;

  background: rgba(112, 119, 141, 0.538);
  border: 1px solid rgba(231, 230, 249, 0.9);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  color: var(--white);
  font-size: var(--font-size-ms);
  font-weight: 500;
  text-shadow: none;

  box-shadow: 0 2px 6px rgba(226, 229, 244, 0.459);
  z-index: 20;
}

/* 꼬리 */
.tooltip-content::after {
  content: '';
  position: absolute;
  top: -6px;
  left: 16px;
  width: 0;
  height: 0;

  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid rgba(112, 119, 141, 0.538);

  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* transition */
.tooltip-enter-active,
.tooltip-leave-active {
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}
.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

/* --- 본문 --- */
.fund-item-content-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
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
  font-weight: var(--font-weight-medium);
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

.news-row {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 12px;
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

<template>
  <section
    class="etf-item-container"
    @click="goToDetail">
    <section class="etf-item-header-section">
      <div class="etf-item-sub-title">
        {{ countryLabelMap[item.productCountry] ?? item.productCountry }}
        ・
        {{ typeLabelMap[item.productType] ?? item.productType }}
        <!-- 오른쪽 끝: 추천 툴팁 아이콘 (추천일 때만) -->
        <div
          class="etf-item-title-right"
          v-if="recommended">
          <div
            class="icon-wrapper icon-question"
            @click.stop="showRecoTip = !showRecoTip">
            <IconQuestion />
            <Transition name="tooltip">
              <div
                v-if="showRecoTip"
                class="tooltip-content">
                최근 본 뉴스를 기반으로 추천합니다.
              </div>
            </Transition>
          </div>
        </div>
      </div>

      <header class="etf-item-header">
        <div class="etf-item-title-left">
          <span class="product-name">{{ item.productName }}</span>
          <span
            v-if="item.userOwns"
            class="own-tag">
            보유중
          </span>
        </div>
        <HeartToggle
          :product-code="item.productCode"
          category="etf"
          :user-watches="item.userWatches || false"
          @click.stop />
      </header>

      <div
        v-if="item.isPopularInUserGroup"
        class="user-group-popular-badge">
        안정추구형 HOT
      </div>
    </section>

    <section class="etf-item-content-section">
      <div class="info-row">
        <span class="label">현재가</span>
        <span class="value">
          {{
            item.currentPrice != null && item.currentPrice !== ''
              ? fmtNumber(item.currentPrice) + '원'
              : '-'
          }}
        </span>
      </div>
      <div class="info-row">
        <span class="label">거래량</span>
        <span class="value">
          {{ item.volume != null && item.volume !== '' ? fmtNumber(item.volume) + '주' : '-' }}
        </span>
      </div>
      <div class="info-row">
        <span class="label">수익률(3개월)</span>
        <span
          class="value"
          :class="changeClass"
          >{{ fmtPercent(item.return3Months) }}</span
        >
      </div>
      <div class="info-row">
        <span class="label">기준가</span>
        <span class="value">
          {{ item.etfNav != null && item.etfNav !== '' ? fmtNumber(item.etfNav) + '원' : '-' }}
        </span>
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
            :style="getSegmentStyle(key)"></div>
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
// 카드 바깥 클릭 시 툴팁 닫힘
const onDocClick = () => (showRecoTip.value = false);
document.addEventListener('click', onDocClick);
onBeforeUnmount(() => document.removeEventListener('click', onDocClick));

function goToDetail() {
  router.push(`/etf/${props.item.productCode}`);
}

function fmtNumber(n) {
  if (n == null || n === '') return '-';
  const num = Number(n);
  if (Number.isNaN(num)) return '-';
  return num.toLocaleString('ko-KR');
}
function fmtPercent(v) {
  if (v == null || v === '') return '-';
  let num = Number(v);
  if (Number.isNaN(num)) return '-';
  if (Math.abs(num) > 0 && Math.abs(num) < 1) num *= 100;
  return `${num.toFixed(2)}%`;
}

const changeClass = computed(() => {
  const v = Number(props.item?.return3Months);
  if (Number.isNaN(v)) return '';
  if (v > 0) return 'up';
  if (v < 0) return 'down';
  return 'flat';
});

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
  align-items: center;
  gap: 6px;
}

/* 오른쪽 끝의 추천 툴팁 영역 */
.etf-item-title-right {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  position: relative;
}
/* 아이콘 + 툴팁 (FundItem과 동일 패턴) */
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
/*  아이콘의 '왼쪽 위' 방향으로 뜨도록 재배치 */
.tooltip-content {
  position: absolute;
  right: calc(100% + 8px); /* 아이콘 위로 */
  left: auto;
  top: -15px; /* 기존 값 무효화 */
  transform: none;
  width: max-content;
  max-width: 250px;
  padding: 10px 15px;
  white-space: normal;
  word-break: keep-all;
  border-radius: 8px;
  background-color: rgb(from var(--main01) r g b / 0.85);
  color: var(--white);
  font-size: var(--font-size-sm);
  z-index: 10;
}
/* ▶ 오른쪽을 향하는 꼬리(툴팁의 오른쪽 중앙) */
.tooltip-content::after {
  content: '';
  position: absolute;
  top: 65%;
  right: -11px; /* 툴팁 오른쪽 바깥으로 살짝 */
  transform: translateY(-50%);
  border-width: 6px;
  border-style: solid;
  /* top | right | bottom | left (왼쪽 보더에 색 → ▶) */
  border-color: transparent transparent transparent rgb(from var(--main01) r g b / 0.85);
}
.tooltip-enter-active,
.tooltip-leave-active {
  transition: opacity 0.2s ease-out;
}
.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
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
</style>

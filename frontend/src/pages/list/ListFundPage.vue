<template>
  <div class="list-fund-page-container">
    <FilterSortBar
      :filters="filters"
      :selected="selected"
      @change="onFilterChange" />

    <!-- 추천 펀드 -->
    <section
      v-if="topFunds.length"
      class="list-fund-reco">
      <div class="reco-grid">
        <FundItem
          v-for="fund in topFunds"
          :key="'rec-' + fund.productCode"
          :item="fund"
          recommended="true" />
      </div>
    </section>

    <!-- 일반 펀드 목록 -->
    <section class="list-fund-page-contents">
      <FundItem
        v-for="fund in restFunds"
        :key="fund.productCode"
        :item="fund" />
      <div
        v-if="loading"
        class="loading">
        <img
          :src="LoadingSpinnerSmall"
          width="30"
          height="30" />
      </div>

      <div
        v-if="!loading && !list.length && !topFunds.length"
        class="no-result">
        <img
          :src="MovingBear"
          class="bear"
          width="50"
          height="50" />
        조건에 맞는 상품이 없습니다
      </div>

      <div
        ref="sentinelEl"
        class="sentinel" />
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { getFinFilters, setFinFilters } from '@/utils/filterStorage';
import FilterSortBar from '@/components/list/FilterSortBar.vue';
import FundItem from '@/components/list/FundItem.vue';
import { getFunds, getFundOneByCode } from '@/api/productApi';
import { useInfiniteScroll } from '@/composables/useInfiniteScroll';
import LoadingSpinnerSmall from '@/assets/loading-spinner-small.gif';
import MovingBear from '@/assets/moving_bear.gif';
import { useRecommendationStore } from '@/stores/recommendationStore';

// ────────────────────────────────────
// 필터 정의
// ────────────────────────────────────
const filters = [
  { key: 'country', label: '국가', options: ['전체', '국내', '해외'] },
  { key: 'fund_type', label: '유형', options: ['전체', '주식형', '채권형', '혼합형'] },
  { key: 'sort', label: '정렬', options: ['수익률순', '펀드규모순'] }
];

const selected = ref({ country: '전체', fund_type: '전체', sort: '수익률순' });
const sortMap = { 수익률순: 'rate_of_return', 펀드규모순: 'fund_scale' };
const countryMap = { 전체: undefined, 국내: 'domestic', 해외: 'foreign' };
const typeMap = { 전체: undefined, 주식형: 'equity', 채권형: 'bond', 혼합형: 'mixed' };

const currentParams = () => ({
  sort: sortMap[selected.value.sort],
  country: countryMap[selected.value.country],
  type: typeMap[selected.value.fund_type],
  is_matched: getFinFilters().isMatched
});

// ────────────────────────────────────
// 추천 코드 & 상단 고정
// ────────────────────────────────────
const recStore = useRecommendationStore();
const topFunds = ref([]);

const loadTopFunds = async () => {
  const topCodes = recStore.topCodesByCategory('fund', 1) || [];
  if (!topCodes.length) {
    topFunds.value = [];
    return;
  }
  console.log('topCodes: ', topCodes);

  const results = await Promise.all(topCodes.map(code => getFundOneByCode(code).catch(() => null)));

  // null 제거 + 중복 제거
  const seen = new Set();
  topFunds.value = results
    .filter(Boolean)
    .filter(f => (seen.has(f.productCode) ? false : (seen.add(f.productCode), true)));
};

// ────────────────────────────────────
// 무한 스크롤
// ────────────────────────────────────
const { list, loading, sentinelEl, reset } = useInfiniteScroll(
  async ({ limit, offset }) => {
    const { sort, country, type, is_matched } = currentParams();
    return await getFunds(sort, country, type, is_matched, limit, offset);
  },
  { pageSize: 4, deps: [selected] }
);

// 상단 고정 제외한 나머지 목록
const restFunds = computed(() => {
  const excludeSet = new Set(topFunds.value.map(f => f.productCode));
  return list.value.filter(it => !excludeSet.has(it.productCode));
});

// ────────────────────────────────────
// 필터 변경
// ────────────────────────────────────
const onFilterChange = async (key, value) => {
  selected.value[key] = value;
  setFinFilters({ ...getFinFilters(), fund: { ...selected.value } });
  await reset();
};

// ────────────────────────────────────
// 마운트 & 언마운트
// ────────────────────────────────────
const handleMatchedChange = async () => {
  await reset();
};

onMounted(async () => {
  // 저장된 필터 복원
  const saved = getFinFilters().fund || {};
  filters.forEach(opt => {
    selected.value[opt.key] = opt.options.includes(saved[opt.key])
      ? saved[opt.key]
      : opt.options[0];
  });

  await recStore.ensureLoaded(10);
  await loadTopFunds();
  await reset();

  window.addEventListener('isMatchedChanged', handleMatchedChange);
});

onBeforeUnmount(() => {
  window.removeEventListener('isMatchedChanged', handleMatchedChange);
});
</script>

<style scoped>
.list-fund-page-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
}

/* 추천 섹션 */
.list-fund-reco {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.reco-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 목록 섹션 */
.list-fund-page-contents {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.loading {
  padding: 12px;
  text-align: center;
}

.no-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 60px;
  text-align: center;
  color: var(--main02);
  font-size: 14px;
}

.sentinel {
  height: 1px;
  width: 100%;
}
</style>

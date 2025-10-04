<template>
  <div class="list-etf-page-container">
    <FilterSortBar
      :filters="filters"
      :selected="selected"
      @change="onFilterChange" />

    <!-- 추천 ETF -->
    <section
      v-if="topEtfs.length"
      class="list-etf-reco">
      <div class="reco-grid">
        <EtfItem
          v-for="item in topEtfs"
          :key="'rec-' + item.productCode"
          :item="item"
          recommended />
      </div>
    </section>

    <!-- 일반 ETF 목록 -->
    <section class="list-etf-page-contents">
      <EtfItem
        v-for="item in restEtfs"
        :key="item.productCode"
        :item="item" />

      <div
        v-if="loading"
        class="loading">
        <img
          :src="LoadingSpinnerSmall"
          alt="loading"
          width="30"
          height="30" />
      </div>

      <div
        v-if="!loading && !list.length && !topEtfs.length"
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
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';
import { useWebSocketStore } from '@/stores/websocket';
import EtfItem from '@/components/list/EtfItem.vue';
import FilterSortBar from '@/components/list/FilterSortBar.vue';
import { getFinFilters, setFinFilters } from '@/utils/filterStorage';
import { getEtfs, getEtfOneByCode } from '@/api/productApi';
import { useInfiniteScroll } from '@/composables/useInfiniteScroll';
import LoadingSpinnerSmall from '@/assets/loading-spinner-small.gif';
import MovingBear from '@/assets/moving_bear.gif';
import { useRecommendationStore } from '@/stores/recommendationStore';

// ─────────────────────────────────────
// 필터 정의
// ─────────────────────────────────────
const filters = [
  { key: 'country', label: '국가', options: ['전체', '국내', '해외'] },
  { key: 'etf_type', label: '유형', options: ['전체', '주식형', '채권형', '혼합형'] },
  { key: 'sort', label: '정렬', options: ['기준가 높은순', '기준가 낮은순'] }
];

const selected = ref({ country: '전체', etf_type: '전체', sort: '기준가 높은순' });
const sortMap = { '기준가 높은순': 'desc', '기준가 낮은순': 'asc' };
const countryMap = { 전체: undefined, 국내: 'domestic', 해외: 'foreign' };
const typeMap = { 전체: undefined, 주식형: 'equity', 채권형: 'bond', 혼합형: 'mixed' };

const currentParams = () => ({
  sort: sortMap[selected.value.sort],
  country: countryMap[selected.value.country],
  type: typeMap[selected.value.etf_type],
  is_matched: getFinFilters().isMatched
});

// ─────────────────────────────────────
// 추천 ETF 상단 고정 (0~1개)
// ─────────────────────────────────────
const recStore = useRecommendationStore();
const topEtfs = ref([]);

const loadTopEtfs = async () => {
  const topCodes = recStore.topCodesByCategory('etf', 1) || [];
  if (!topCodes.length) {
    topEtfs.value = [];
    return;
  }
  const results = await Promise.all(topCodes.map(code => getEtfOneByCode(code).catch(() => null)));
  // null 제거 + productCode 중복 제거
  const seen = new Set();
  topEtfs.value = results
    .filter(Boolean)
    .filter(it => (seen.has(it.productCode) ? false : (seen.add(it.productCode), true)));
};

// ─────────────────────────────────────
// 무한 스크롤 (일반 목록)
// ─────────────────────────────────────
const { list, loading, sentinelEl, reset } = useInfiniteScroll(
  async ({ limit, offset }) => {
    const { sort, country, type, is_matched } = currentParams();
    return await getEtfs(sort, country, type, is_matched, limit, offset);
  },
  { pageSize: 4, deps: [selected] }
);

// 상단 고정 제외한 나머지 목록
const restEtfs = computed(() => {
  const exclude = new Set(topEtfs.value.map(it => it.productCode));
  return list.value.filter(it => !exclude.has(it.productCode));
});

// ─────────────────────────────────────
// 웹소켓
// ─────────────────────────────────────
const ws = useWebSocketStore();
const subscribedCodes = ref(new Set());

// code → { where: 'top'|'list', idx } 매핑
const indexByCode = ref(new Map());

const rebuildIndexMap = () => {
  const m = new Map();
  topEtfs.value.forEach((it, idx) => {
    if (it?.productCode) m.set(it.productCode, { where: 'top', idx });
  });
  restEtfs.value.forEach((it, idx) => {
    if (it?.productCode) m.set(it.productCode, { where: 'list', idx });
  });
  indexByCode.value = m;
};

const handleTick = (payload, productCodeFromTopic) => {
  const code = payload?.productCode || productCodeFromTopic;
  const loc = indexByCode.value.get(code);
  if (!loc) return;

  if (loc.where === 'top') {
    const cur = topEtfs.value[loc.idx];
    if (!cur) return;
    topEtfs.value[loc.idx] = {
      ...cur,
      currentPrice: payload.currentPrice ?? cur.currentPrice,
      changeRate: payload.changeRate1s ?? payload.changeRate ?? cur.changeRate,
      currentVolume: payload.currentVolume ?? cur.currentVolume,
      volume: payload.currentVolume ?? payload.volume ?? cur.volume,
      return3Months: payload.return3Months ?? cur.return3Months,
      changeFromPrevDay: payload.changeFromPrevDay ?? cur.changeFromPrevDay,
      changeRateFromPrevDay: payload.changeRateFromPrevDay ?? cur.changeRateFromPrevDay,
      lastUpdate: payload.timestamp ?? cur.lastUpdate
    };
  } else {
    const originalIdx = list.value.findIndex(v => v?.productCode === code);
    if (originalIdx < 0) return;
    const cur = list.value[originalIdx];
    list.value[originalIdx] = {
      ...cur,
      currentPrice: payload.currentPrice ?? cur.currentPrice,
      changeRate: payload.changeRate1s ?? payload.changeRate ?? cur.changeRate,
      currentVolume: payload.currentVolume ?? cur.currentVolume,
      volume: payload.currentVolume ?? payload.volume ?? cur.volume,
      return3Months: payload.return3Months ?? cur.return3Months,
      changeFromPrevDay: payload.changeFromPrevDay ?? cur.changeFromPrevDay,
      changeRateFromPrevDay: payload.changeRateFromPrevDay ?? cur.changeRateFromPrevDay,
      lastUpdate: payload.timestamp ?? cur.lastUpdate
    };
  }
};

const resubscribe = async () => {
  await ws.ensureConnection();
  const next = new Set([
    ...topEtfs.value.map(it => it.productCode).filter(Boolean),
    ...list.value.map(it => it.productCode).filter(Boolean)
  ]);

  // 해제
  for (const code of Array.from(subscribedCodes.value)) {
    if (!next.has(code)) {
      ws.unsubscribe(`/topic/etf/${code}`);
      subscribedCodes.value.delete(code);
    }
  }
  // 신규
  for (const code of Array.from(next)) {
    if (!subscribedCodes.value.has(code)) {
      ws.subscribeToEtf(code, payload => handleTick(payload, code));
      subscribedCodes.value.add(code);
    }
  }
};

// 상단/일반의 code 세트가 변하면 인덱스/구독 갱신
const codesKey = computed(() => {
  const top = topEtfs.value
    .map(it => it?.productCode)
    .filter(Boolean)
    .join('|');
  const rest = list.value
    .map(it => it?.productCode)
    .filter(Boolean)
    .join('|');
  return `${top}||${rest}`;
});
watch(codesKey, () => {
  rebuildIndexMap();
  resubscribe();
});

// 소켓 재연결 시 재구독
watch(
  () => ws.isConnected,
  ok => {
    if (ok) {
      rebuildIndexMap();
      resubscribe();
    }
  }
);

// ─────────────────────────────────────
// 필터/매칭 변경
// ─────────────────────────────────────
const handleMatchedChange = async () => {
  await reset();
};

const onFilterChange = async (key, value) => {
  selected.value[key] = value;
  setFinFilters({ ...getFinFilters(), etf: { ...selected.value } });
  await handleMatchedChange();
};

// ─────────────────────────────────────
// 마운트 & 언마운트
// ─────────────────────────────────────
onMounted(async () => {
  // 저장된 필터 복원
  const saved = getFinFilters().etf || {};
  filters.forEach(opt => {
    selected.value[opt.key] = opt.options.includes(saved[opt.key])
      ? saved[opt.key]
      : opt.options[0];
  });

  await recStore.ensureLoaded(10);
  await loadTopEtfs();
  await reset();

  window.addEventListener('isMatchedChanged', handleMatchedChange);
});

onBeforeUnmount(() => {
  window.removeEventListener('isMatchedChanged', handleMatchedChange);
  for (const code of Array.from(subscribedCodes.value)) {
    ws.unsubscribe(`/topic/etf/${code}`);
  }
  subscribedCodes.value.clear();
});
</script>

<style scoped>
.list-etf-page-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
}

/* 추천 섹션 */
.list-etf-reco {
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
.list-etf-page-contents {
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

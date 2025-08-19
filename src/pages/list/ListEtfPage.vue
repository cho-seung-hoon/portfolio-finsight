<template>
  <div class="list-etf-page-container">
    <FilterSortBar
      :filters="filters"
      :selected="selected"
      @change="onFilterChange" />

    <!-- 추천 ETF (목록에 존재하는 추천만 최대 2개) -->
    <section
      v-if="pinnedEtfs.length"
      class="list-etf-reco">
      <div class="reco-grid">
        <EtfItem
          v-for="item in pinnedEtfs"
          :key="'rec-' + item.productCode"
          :item="item"
          recommended />
      </div>
    </section>

    <!-- 일반 ETF 목록 (추천 제외, 무한 스크롤 유지) -->
    <section class="list-etf-page-contents">
      <EtfItem
        v-for="item in restEtfs"
        :key="item.productCode"
        :item="item"
        :recommended="recCodeSet.has(item.productCode)" />

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
        v-if="!loading && !list.length"
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
import { getEtfs } from '@/api/productApi';
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
// 추천 etf / 일반 etf
// ─────────────────────────────────────
const recStore = useRecommendationStore();
const recCodeSet = computed(() => new Set(recStore.topCodesByCategory('etf', 1)));
const pinnedEtfs = computed(() =>
  list.value.filter(it => recCodeSet.value.has(it.productCode)).slice(0, 2)
);
const restEtfs = computed(() => list.value.filter(it => !recCodeSet.value.has(it.productCode)));

// ─────────────────────────────────────
// 무한 스크롤
// ─────────────────────────────────────
const { list, loading, sentinelEl, reset } = useInfiniteScroll(
  async ({ limit, offset }) => {
    const { sort, country, type, is_matched } = currentParams();
    return await getEtfs(sort, country, type, is_matched, limit, offset);
  },
  { pageSize: 4, deps: [selected] }
);

// ─────────────────────────────────────
// isMatched 변경 시
// ─────────────────────────────────────
const handleMatchedChange = () => {
  for (const code of Array.from(subscribedCodes.value)) {
    ws.unsubscribe(`/topic/etf/${code}`);
  }
  subscribedCodes.value.clear();
  reset();
};

// ─────────────────────────────────────
// 필터 변경
// ─────────────────────────────────────
const onFilterChange = (key, value) => {
  selected.value[key] = value;
  setFinFilters({ ...getFinFilters(), etf: { ...selected.value } });
  handleMatchedChange();
};

// ─────────────────────────────────────
// 웹소켓
// ─────────────────────────────────────
const ws = useWebSocketStore();
const subscribedCodes = ref(new Set());
const indexByCode = ref(new Map());

const rebuildIndexMap = () => {
  const m = new Map();
  list.value.forEach((it, idx) => {
    if (it?.productCode) m.set(it.productCode, idx);
  });
  indexByCode.value = m;
};

const handleTick = (payload, productCodeFromTopic) => {
  const code = payload?.productCode || productCodeFromTopic;
  const idx = indexByCode.value.get(code);
  if (idx === undefined) return;

  const cur = list.value[idx];
  list.value[idx] = {
    ...cur,
    // 서버 필드명과 매핑 확인 필수
    currentPrice: payload.currentPrice ?? cur.currentPrice,
    changeRate: payload.changeRate1s ?? payload.changeRate ?? cur.changeRate,
    currentVolume: payload.currentVolume ?? cur.currentVolume,
    volume: payload.currentVolume ?? payload.volume ?? cur.volume,
    return3Months: payload.return3Months ?? cur.return3Months,
    changeFromPrevDay: payload.changeFromPrevDay ?? cur.changeFromPrevDay,
    changeRateFromPrevDay: payload.changeRateFromPrevDay ?? cur.changeRateFromPrevDay,
    lastUpdate: payload.timestamp ?? cur.lastUpdate
  };
};

const resubscribe = async () => {
  await ws.ensureConnection();

  const next = new Set(list.value.map(it => it.productCode).filter(Boolean));

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

// productCode 집합이 바뀔 때만 재구독 (가격 등 필드 변경에는 반응하지 않음)
const codesKey = computed(() =>
  list.value
    .map(it => it?.productCode)
    .filter(Boolean)
    .join('|')
);
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

  // 추천 먼저 준비 → 목록 로드(무한 스크롤 시작)
  await recStore.ensureLoaded(10);
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
.reco-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semi-bold);
  color: var(--main01);
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

<template>
  <div class="list-etf-page-container">
    <FilterSortBar
      :filters="filters"
      :selected="selected"
      @change="onFilterChange" />
    <section class="list-etf-page-contents">
      <EtfItem
        v-for="item in list"
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
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useWebSocketStore } from '@/stores/websocket';
import EtfItem from '@/components/list/EtfItem.vue';
import FilterSortBar from '@/components/list/FilterSortBar.vue';
import { getFinFilters, setFinFilters } from '@/utils/filterStorage';
import { getEtfs } from '@/api/productApi';
import { useInfiniteScroll } from '@/composables/useInfiniteScroll';
import LoadingSpinnerSmall from '@/assets/loading-spinner-small.gif';
import MovingBear from '@/assets/moving_bear.gif';

const filters = [
  { key: 'country', label: '국가', options: ['전체', '국내', '해외'] },
  { key: 'etf_type', label: '유형', options: ['전체', '주식형', '채권형', '혼합형'] },
  { key: 'sort', label: '정렬', options: ['기준가 높은순', '기준가 낮은순'] }
];
const selected = ref({ country: '전체', etf_type: '전체', sort: '기준가 높은순' });
const sortMap = { '기준가 높은순': 'desc', '기준가 낮은순': 'asc' };
const countryMap = { 전체: undefined, 국내: 'domestic', 해외: 'foreign' };
const typeMap = { 전체: undefined, 주식형: 'equity', 채권형: 'bond', 혼합형: 'mixed' };

const onFilterChange = (key, value) => {
  selected.value[key] = value;
  setFinFilters({
    ...getFinFilters(),
    etf: { ...selected.value }
  });
};

const currentParams = () => ({
  sort: sortMap[selected.value.sort],
  country: countryMap[selected.value.country],
  type: typeMap[selected.value.etf_type],
  is_matched: getFinFilters().isMatched
});

const { list, loading, sentinelEl, reset, observe } = useInfiniteScroll(
  async ({ limit, offset }) => {
    const { sort, country, type, is_matched } = currentParams();
    return await getEtfs(sort, country, type, is_matched, limit, offset);
  },
  { pageSize: 4, deps: [selected] }
);

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

// 리스트가 바뀔 때마다 인덱스 맵 갱신 + 구독 동기화
watch(
  list,
  () => {
    rebuildIndexMap();
    resubscribe();
  },
  { deep: true }
);

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

const handleMatchedChange = () => {
  for (const code of Array.from(subscribedCodes.value)) {
    ws.unsubscribe(`/topic/etf/${code}`);
  }
  subscribedCodes.value.clear();
  reset();
};

onMounted(async () => {
  const saved = getFinFilters().etf || {};
  filters.forEach(opt => {
    selected.value[opt.key] = opt.options.includes(saved[opt.key])
      ? saved[opt.key]
      : opt.options[0];
  });

  await reset();
  observe();

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

.list-etf-page-contents {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.loading {
  padding: 12px;
  text-align: center;
}

.end,
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

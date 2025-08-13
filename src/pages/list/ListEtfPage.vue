<template>
  <div class="list-etf-page-container">
    <FilterSortBar
      :filters="filters"
      :selected="selected"
      @change="onChange" />
    <section class="list-etf-page-contents">
      <EtfItem
        v-for="item in etfs"
        :key="item.productCode"
        :item="item" />
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

// ─────────────────────────────────────
// 기본
// ─────────────────────────────────────
const filters = [
  { key: 'country', label: '국가', options: ['전체', '국내', '해외'] },
  { key: 'etf_type', label: '유형', options: ['전체', '주식형', '채권형', '혼합형'] },
  { key: 'sort', label: '정렬', options: ['수익률순', '거래량순', '조회수순'] }
];

const selected = ref({ country: '전체', etf_type: '전체', sort: '수익률순' });
const sortMap = { 수익률순: 'rate_of_return', 거래량순: 'volume', 조회수순: 'view_count' };
const countryMap = { 전체: undefined, 국내: 'domestic', 해외: 'foreign' };
const typeMap = { 전체: undefined, 주식형: 'equity', 채권형: 'bond', 혼합형: 'mixed' };
const etfs = ref([]);

// ─────────────────────────────────────
// 웹소켓
// ─────────────────────────────────────
const ws = useWebSocketStore();
const subscribedCodes = ref(new Set()); // 현재 이 페이지에서 구독 중인 코드 Set
const indexByCode = ref(new Map());
let resubLock = false;

// 목록 로드
async function fetchEtfs() {
  const sort = sortMap[selected.value.sort];
  const country = countryMap[selected.value.country];
  const type = typeMap[selected.value.etf_type];
  const isMatched = getFinFilters().isMatched || false;

  const list = await getEtfs(sort, country, type, isMatched);
  etfs.value = Array.isArray(list) ? list : [];

  // 인덱스 맵 갱신
  const m = new Map();
  etfs.value.forEach((it, idx) => {
    if (it?.productCode) m.set(it.productCode, idx);
  });
  indexByCode.value = m;
}

function handleTick(payload, productCodeFromTopic) {
  const code = payload?.productCode || productCodeFromTopic; // 둘 중 하나
  const idx = indexByCode.value.get(code);
  if (idx === undefined) return;

  const cur = etfs.value[idx];
  const merged = {
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

  etfs.value[idx] = merged;
}

// 현재 etfs 기준으로 증감 구독
async function resubscribe() {
  if (resubLock) return;
  resubLock = true;
  try {
    await ws.ensureConnection();

    const next = new Set(etfs.value.map(it => it.productCode).filter(Boolean));

    // 해제 대상
    const toUnsub = Array.from(subscribedCodes.value).filter(code => !next.has(code));
    if (toUnsub.length) {
      toUnsub.forEach(code => {
        ws.unsubscribe(`/topic/etf/${code}`);
        subscribedCodes.value.delete(code);
      });
    }

    // 신규 구독
    const toSub = Array.from(next).filter(code => !subscribedCodes.value.has(code));
    if (toSub.length) {
      for (const code of toSub) {
        ws.subscribeToEtf(code, payload => handleTick(payload, code));
        subscribedCodes.value.add(code);
      }
    }
  } finally {
    resubLock = false;
  }
}

// 필터 변경
function onChange(key, value) {
  selected.value[key] = value;
  setFinFilters({ ...getFinFilters(), etf: { ...selected.value } });
  fetchEtfs().then(resubscribe);
}

// 재연결 시 자동 재구독
watch(
  () => ws.isConnected,
  ok => {
    if (ok && subscribedCodes.value.size) {
      const codes = Array.from(subscribedCodes.value); // 기존 코드들 재구독(토픽 문자열로 이미 스토어가 관리하지만, 확실히 덮어쓰기)
      subscribedCodes.value.clear();
      fetchEtfs().then(resubscribe);
      codes.forEach(code => ws.subscribeToEtf(code, p => handleTick(p, code)));
      codes.forEach(code => subscribedCodes.value.add(code));
    }
  }
);

onMounted(async () => {
  const saved = getFinFilters().etf || {};
  filters.forEach(opt => {
    selected.value[opt.key] = opt.options.includes(saved[opt.key])
      ? saved[opt.key]
      : opt.options[0];
  });
  await fetchEtfs();
  await resubscribe();

  window.addEventListener('isMatchedChanged', handleMatchedChange);
});

function handleMatchedChange() {
  fetchEtfs().then(resubscribe);
}

onBeforeUnmount(() => {
  window.removeEventListener('isMatchedChanged', handleMatchedChange);
  if (subscribedCodes.value.size) {
    Array.from(subscribedCodes.value).forEach(code => ws.unsubscribe(`/topic/etf/${code}`));
    subscribedCodes.value.clear();
  }
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
</style>

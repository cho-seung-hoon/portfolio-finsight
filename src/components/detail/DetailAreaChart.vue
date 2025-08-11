<template>
  <div class="area-chart-wrapper">
    <div class="date-range-btns">
      <button
        v-for="(label, idx) in rangeLabels"
        :key="label"
        :class="{ active: selectedRangeIdx === idx }"
        type="button"
        @click.stop.prevent="selectRange(idx)"
      >
        {{ label }}
      </button>
    </div>
    <div ref="chartContainer" class="chart-container" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { createChart } from 'lightweight-charts';

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  category:String
});

console.log("chart props date : " , props);

const chartContainer = ref(null);
let chart = null;
let priceSeries = null; // 가격 데이터 시리즈 (Line)
let yieldSeries = null; // 수익률 데이터 시리즈 (Area)

const rangeLabels = ['1주', '2주', '1달', '3달'];
const rangeDays = [7, 14, 30, 90];
const selectedRangeIdx = ref(3); // 기본 선택을 '3달'로 설정

// [핵심 수정 1] 데이터 정규화 함수 보강
// 스토어에서 넘어오는 세 가지 다른 데이터 형식을 모두 처리하도록 수정합니다.
const normalizedData = computed(() => {
  if (!props.data || props.data.length === 0) return [];

  if (props.category === 'fund') {
    // Fund 데이터 처리
    return props.data
      .map(item => {
        if (item.date && item['기준가'] !== undefined && item['수익률'] !== undefined) {
          return {
            time: new Date(item.date).getTime() / 1000,
            price: Number(item['기준가']),
            yield: Number(item['수익률'])
          };
        }
        return null;
      })
      .filter(Boolean);
  } else if (props.category === 'etf') {
    // ETF 기존 처리 로직 유지
    return props.data
      .map(item => {
        if (item.date && item.price) {
          const firstPrice = props.data[0].price;
          const yieldValue = (((item.price - firstPrice) / firstPrice) * 100);
          return {
            time: new Date(item.date).getTime() / 1000,
            price: Number(item.price),
            yield: Number(yieldValue.toFixed(1))
          };
        }
        if (item.baseDate && item.etfNav !== undefined) {
          const firstNav = props.data[0].etfNav;
          const yieldValue = (((item.etfNav - firstNav) / firstNav) * 100);
          return {
            time: new Date(item.baseDate[0], item.baseDate[1] - 1, item.baseDate[2]).getTime() / 1000,
            price: Number(item.etfNav),
            yield: Number(yieldValue.toFixed(1))
          };
        }
        // 실시간 웹소켓 데이터 처리 등 기타 필요한 로직 유지 가능
        if (item.timestamp) {
          return {
            time: Math.floor(item.timestamp / 1000),
            price: Number(item.current_price),
            yield: Number(item.change_rate1s)
          };
        }
        return null;
      })
      .filter(Boolean);
  }
  return [];
});

const filteredData = computed(() => {
  if (normalizedData.value.length === 0) return [];

  // [핵심 수정] 중복된 타임스탬프 제거 로직 추가
  // 1. 먼저 데이터를 시간순으로 정렬합니다.
  const sorted = [...normalizedData.value].sort((a, b) => a.time - b.time);

  // 2. Map을 사용하여 타임스탬프 중복을 제거합니다.
  // 동일한 타임스탬프(key)가 여러 번 들어오면, Map은 마지막에 들어온 값으로 덮어쓰기 때문에
  // 자연스럽게 가장 최신 데이터만 남게 됩니다.
  const uniqueDataMap = new Map();
  sorted.forEach(item => {
    uniqueDataMap.set(item.time, item);
  });

  // 3. Map의 값들을 다시 배열로 변환하여 중복이 제거된 데이터 목록을 만듭니다.
  const uniqueSortedData = Array.from(uniqueDataMap.values());

  // 4. 날짜 범위에 따라 필터링합니다.
  const days = rangeDays[selectedRangeIdx.value];
  if (uniqueSortedData.length === 0) return [];

  const endDate = uniqueSortedData[uniqueSortedData.length - 1].time;
  const startDate = endDate - days * 24 * 60 * 60;

  return uniqueSortedData.filter(d => d.time >= startDate);
});

const updateChartSeries = () => {
  if (!chart || !priceSeries || !yieldSeries) return;

  const priceData = filteredData.value.map(d => ({ time: d.time, value: d.price }));
  const yieldData = filteredData.value.map(d => ({ time: d.time, value: d.yield }));

  // 데이터가 2개 이상 있어야 라인과 영역이 그려집니다.
  if (priceData.length >= 2) {
    priceSeries.setData(priceData);
    yieldSeries.setData(yieldData);
  }

  // 차트의 시간 축이 모든 데이터를 포함하도록 자동으로 조절합니다.
  chart.timeScale().fitContent();
};

const selectRange = idx => {
  selectedRangeIdx.value = idx;
};

onMounted(() => {
  // nextTick을 사용하여 DOM이 완전히 렌더링된 후 차트를 생성합니다.
  nextTick(() => {
    if (!chartContainer.value) return;

    // [핵심 수정 2] 차트 옵션 추가 (특히, 좌/우 Y축 설정)
    chart = createChart(chartContainer.value, {
      layout: {
        background: { color: 'transparent' },
        textColor: '#333'
      },
      grid: {
        vertLines: { style: 2, color: '#f0f0f0' },
        horzLines: { style: 2, color: '#f0f0f0' }
      },
      rightPriceScale: { // 가격 축 (오른쪽)
        visible: true,
        borderColor: '#059669'
      },
      leftPriceScale: { // 수익률 축 (왼쪽)
        visible: true,
        borderColor: '#2563eb'
      },
      timeScale: {
        borderColor: '#ccc',
        timeVisible: true,
        secondsVisible: false,
      }
    });

    // 가격 시리즈 (라인 차트, 오른쪽 축 사용)
    priceSeries = chart.addLineSeries({
      priceScaleId: 'right',
      color: '#059669',
      lineWidth: 2
    });

    // 수익률 시리즈 (영역 차트, 왼쪽 축 사용)
    yieldSeries = chart.addAreaSeries({
      priceScaleId: 'left',
      lineColor: '#2563eb',
      topColor: 'rgba(37, 99, 235, 0.4)',
      bottomColor: 'rgba(37, 99, 235, 0)'
    });

    // 데이터가 준비되면 차트를 그립니다.
    updateChartSeries();
  });
});

// [핵심 수정 3] 데이터 변경 감지 및 차트 업데이트
// deep: true로 객체 내부의 변경까지 감지하고, immediate: true로 초기 데이터 로딩 시 바로 차트를 그립니다.
watch(filteredData, updateChartSeries, { deep: true, immediate: true });

onUnmounted(() => {
  if (chart) {
    chart.remove();
    chart = null;
  }
});
</script>

<style scoped>
/* 스타일은 기존 코드와 동일하게 사용하시면 됩니다. */
.chart-container {
  width: 100%;
  height: 320px;
}
.area-chart-wrapper {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 0 8px;
}
.date-range-btns {
  display: flex;
  gap: 6px;
  margin-bottom: 16px;
  justify-content: flex-end;
  flex-wrap: wrap;
}
.date-range-btns button {
  background: var(--main03); color: var(--main01); border: none;
  border-radius: 20px; padding: 6px 14px; font-size: 14px;
  font-weight: 500; cursor: pointer;
}
.date-range-btns button.active {
  background: var(--main01); color: var(--white);
}
</style>
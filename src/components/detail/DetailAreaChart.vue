<template>
  <div class="area-chart-wrapper">
    <div class="date-range-btns">
      <button
        v-for="(label, idx) in rangeLabels"
        :key="label"
        :class="{ active: selectedRangeIdx === idx }"
        type="button"
        @click.stop.prevent="selectRange(idx)">
        {{ label }}
      </button>
    </div>
    <apexchart
      :key="selectedRangeIdx"
      type="area"
      height="320"
      :options="chartOptions"
      :series="chartSeries"
      class="area-chart" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
});

const rangeLabels = ['1 주', '2 주', '1 달', '3 달'];
const rangeDays = [7, 14, 30, 90];
const selectedRangeIdx = ref(0);

function selectRange(idx) {
  selectedRangeIdx.value = idx;
}

const filteredData = computed(() => {
  if (!props.data || !props.data.length) return [];
  const days = rangeDays[selectedRangeIdx.value];
  // 최신 날짜 기준으로 days만큼만 자르기 (날짜 내림차순 정렬 후)
  const sorted = [...props.data].sort((a, b) => new Date(b.date) - new Date(a.date));
  return sorted.slice(0, days).reverse();
});

const chartSeries = computed(() => [
  {
    name: '수익률',
    type: 'area', // area 그래프
    data: filteredData.value.map(d => [d.date, d.수익률])
  },
  {
    name: '기준가',
    type: 'line', // 선 그래프
    data: filteredData.value.map(d => [d.date, d.기준가])
  }
]);

const chartOptions = computed(() => ({
  chart: {
    type: 'line', // 시리즈별 타입을 쓸 때는 'line'으로 지정
    toolbar: { show: false },
    zoom: { enabled: false }
  },
  stroke: {
    curve: 'smooth',
    width: 3
  },
  xaxis: {
    type: 'datetime',
    labels: {
      datetimeFormatter: {
        year: 'yyyy',
        month: 'MM월',
        day: 'MM/dd',
        hour: 'HH:mm'
      }
    }
  },
  yaxis: [
    {
      title: { text: '수익률(%)' },
      labels: {
        formatter: val => `${val}%`
      }
    },
    {
      opposite: true,
      title: { text: '기준가' },
      labels: {
        formatter: val => `${val}`
      }
    }
  ],
  tooltip: {
    x: {
      format: 'yyyy/MM/dd'
    },
    y: [
      {
        formatter: val => `${val}%`
      },
      {
        formatter: val => `${val}`
      }
    ]
  },
  colors: ['#2563eb', '#059669'],
  legend: {
    show: true,
    position: 'top',
    horizontalAlign: 'right'
  },
  dataLabels: {
    enabled: false
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 0.3,
      opacityFrom: 0.9,
      opacityTo: 0.4,
      stops: [0, 90, 100]
    }
  }
}));
</script>

<style scoped>
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
  background: var(--main03);
  color: var(--main01);
  border: none;
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  min-width: 60px;
  text-align: center;
}

.date-range-btns button:hover {
  background: var(--main02);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.date-range-btns button.active {
  background: var(--main01);
  color: var(--white);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.area-chart {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
}

/* 모바일 최적화 */
@media (max-width: 768px) {
  .area-chart-wrapper {
    padding: 0 4px;
  }

  .date-range-btns {
    gap: 4px;
    margin-bottom: 12px;
    justify-content: center;
  }

  .date-range-btns button {
    padding: 5px 12px;
    font-size: 13px;
    border-radius: 16px;
    min-width: 50px;
  }

  .area-chart {
    border-radius: 8px;
  }
}

@media (max-width: 480px) {
  .area-chart-wrapper {
    padding: 0 2px;
  }

  .date-range-btns {
    gap: 3px;
    margin-bottom: 10px;
  }

  .date-range-btns button {
    padding: 4px 10px;
    font-size: 12px;
    border-radius: 14px;
    min-width: 45px;
  }

  .area-chart {
    border-radius: 6px;
  }
}

/* 터치 디바이스 최적화 */
@media (hover: none) and (pointer: coarse) {
  .date-range-btns button {
    min-height: 36px;
    touch-action: manipulation;
  }

  .date-range-btns button:active {
    transform: scale(0.95);
  }
}
</style>

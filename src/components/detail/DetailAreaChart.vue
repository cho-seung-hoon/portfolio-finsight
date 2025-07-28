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
import { ref, computed, watch } from 'vue';

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
  colors: ['var(--main01)', 'var(--red01)'],
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
      shadeIntensity: 0.2,
      opacityFrom: 0.8,
      opacityTo: 0.2,
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
}
.date-range-btns {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  justify-content: flex-end;
}
.date-range-btns button {
  background: var(--main03);
  color: var(--main01);
  border: none;
  border-radius: 16px;
  padding: 4px 16px;
  font-size: 15px;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
}
.date-range-btns button.active {
  background: var(--main01);
  color: var(--main05);
}
.area-chart {
  width: 100%;
}
</style>

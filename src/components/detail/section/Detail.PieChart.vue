<template>
  <div>
    <div
      class="donut-chart-wrapper"
      style="position: relative; display: flex; justify-content: center; align-items: center">
      <apexchart
        width="320"
        type="donut"
        :options="chartOptions"
        :series="series"
        class="pie-chart" />
      <div
        v-if="mainItem"
        class="donut-center-label">
        <div class="center-value">{{ mainItem.value }}%</div>
        <div class="center-label">{{ mainItem.label }}</div>
      </div>
    </div>
    <div class="table-container">
      <table class="pie-table">
        <thead>
          <tr>
            <th>색</th>
            <th>종목명</th>
            <th>비중(%)</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, idx) in standardizedData"
            :key="row.label">
            <td>
              <span
                :style="{
                  display: 'inline-block',
                  width: '16px',
                  height: '16px',
                  'border-radius': '50%',
                  background: colorList[idx % colorList.length]
                }"></span>
            </td>
            <td>{{ row.label }}</td>
            <td>{{ row.value }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  valueKey: {
    type: String,
    default: 'value'
  },
  labelKey: {
    type: String,
    default: 'label'
  }
});

const colorList = [
  'var(--red01)',
  'var(--orange01)',
  'var(--yellow01)',
  'var(--green01)',
  'var(--mint01)',
  'var(--sub01)',
  '#6a5acd',
  '#00acc1',
  '#ff69b4',
  '#8d6e63'
];

function getStandardizedData() {
  if (!props.data || props.data.length === 0) return [];
  const firstItem = props.data[0];
  const keys = Object.keys(firstItem);
  const labelKeyCandidates = ['label', 'name', 'key', '종목명', '항목'];
  const valueKeyCandidates = ['value', 'amount', '비중', '값'];
  const labelKey = labelKeyCandidates.find(key => keys.includes(key)) || props.labelKey;
  const valueKey = valueKeyCandidates.find(key => keys.includes(key)) || props.valueKey;
  return props.data.map(d => {
    let value = d[valueKey];
    if (typeof value === 'string' && value.includes('%')) {
      value = parseFloat(value.replace('%', ''));
    } else {
      value = Number(value);
    }
    if (isNaN(value)) value = 0;
    return {
      label: d[labelKey],
      value: value
    };
  });
}

const standardizedData = computed(() => getStandardizedData());

const series = computed(() => standardizedData.value.map(d => d.value));
const labels = computed(() => standardizedData.value.map(d => d.label));

const selectedIndex = ref(null);
const mainItem = computed(() => {
  if (!standardizedData.value.length) return null;
  if (selectedIndex.value !== null && standardizedData.value[selectedIndex.value]) {
    return standardizedData.value[selectedIndex.value];
  }
  // 기본값: 가장 큰 비중
  return standardizedData.value.reduce((a, b) => (a.value > b.value ? a : b));
});

function onDataPointSelection(event, chartContext, config) {
  if (config && typeof config.dataPointIndex === 'number') {
    selectedIndex.value = config.dataPointIndex;
  }
}

const chartOptions = computed(() => ({
  chart: {
    type: 'donut',
    toolbar: { show: false },
    events: {
      dataPointSelection: onDataPointSelection
    }
  },
  labels: labels.value,
  colors: colorList,
  legend: {
    show: false
  },
  dataLabels: {
    enabled: true,
    style: {
      fontSize: '15px',
      fontWeight: 'bold',
      colors: ['#222']
    },
    formatter: function (val, opts) {
      return `${val.toFixed(1)}%`;
    },
    dropShadow: {
      enabled: false
    },
    background: {
      enabled: false
    }
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return `${val.toFixed(1)}%`;
      }
    }
  },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: false
        }
      }
    }
  }
}));
</script>

<style scoped>
.pie-chart {
  display: flex;
  justify-content: center;
  align-items: center;
}
.donut-chart-wrapper {
  position: relative;
  width: 320px;
  height: 320px;
  margin: 0 auto;
}
.donut-center-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}
.center-value {
  font-size: 2.2rem;
  font-weight: bold;
  color: var(--off-black);
}
.center-label {
  font-size: 1.1rem;
  color: var(--off-black);
  margin-top: 2px;
}
.table-container {
  margin: 24px 0 0 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1px;
}

.pie-table {
  border-collapse: collapse;
  font-size: 15px;
  width: 100%;
  min-width: 300px;
}
.pie-table th,
.pie-table td {
  border: 1px solid var(--main02); /* 기존보다 좀 더 은은한 테두리 */
  padding: 8px 12px;
  text-align: left;
  white-space: nowrap;
}

.pie-table td:nth-child(2) {
  white-space: normal;
  word-break: break-word;
  max-width: 150px;
}

.pie-table th {
  background-color: #d4dbf9; /* var(--main01) 보다 연한 블루 계열 */
  font-weight: 600;
  color: var(--main01); /* 진한 글씨색으로 가독성 확보 */
}

.pie-table tbody tr:nth-child(even) {
  background-color: #f9f9f9; /* 연한 회색으로 행 구분 */
}

.pie-table tbody tr:hover {
  background-color: #f1f5ff; /* 살짝 더 밝은 블루 톤 호버 효과 */
}
</style>

<template>
  <div>
    <div
      class="donut-chart-wrapper"
      style="position: relative; display: flex; justify-content: center; align-items: center">
      <apexchart
        :width="chartWidth"
        :height="chartHeight"
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
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

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

const windowWidth = ref(window.innerWidth);

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener('resize', updateWindowWidth);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth);
});

const chartWidth = computed(() => {
  if (windowWidth.value <= 480) return 240;
  if (windowWidth.value <= 768) return 280;
  return 320;
});

const chartHeight = computed(() => {
  if (windowWidth.value <= 480) return 240;
  if (windowWidth.value <= 768) return 280;
  return 320;
});

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
    },
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800,
      animateGradually: {
        enabled: true,
        delay: 150
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350
      }
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
      fontSize: 'clamp(12px, 2.5vw, 15px)',
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
    },
    offsetY: 0
  },
  tooltip: {
    enabled: true,
    style: {
      fontSize: '14px'
    },
    y: {
      formatter: function (val) {
        return `${val.toFixed(1)}%`;
      }
    },
    marker: {
      show: true
    }
  },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: false
        }
      },
      offsetY: 0,
      customScale: 1
    }
  },
  states: {
    hover: {
      filter: {
        type: 'darken',
        value: 0.1
      }
    },
    active: {
      filter: {
        type: 'darken',
        value: 0.15
      }
    }
  },
  responsive: [
    {
      breakpoint: 768,
      options: {
        chart: {
          width: '100%',
          height: 280
        },
        dataLabels: {
          style: {
            fontSize: '13px'
          }
        }
      }
    },
    {
      breakpoint: 480,
      options: {
        chart: {
          width: '100%',
          height: 240
        },
        dataLabels: {
          style: {
            fontSize: '12px'
          }
        },
        plotOptions: {
          pie: {
            donut: {
              size: '65%'
            }
          }
        }
      }
    }
  ]
}));
</script>

<style scoped>
.pie-chart {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
}

.donut-chart-wrapper {
  position: relative;
  width: 100%;
  max-width: 320px;
  height: auto;
  aspect-ratio: 1;
  margin: 0 auto;
}

.donut-center-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
  width: 80%;
}

.center-value {
  font-size: clamp(1.8rem, 4vw, 2.2rem);
  font-weight: bold;
  color: var(--off-black);
  line-height: 1.2;
}

.center-label {
  font-size: clamp(0.9rem, 2.5vw, 1.1rem);
  color: var(--off-black);
  margin-top: 2px;
  line-height: 1.3;
}

.table-container {
  margin: 24px 0 0 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 12px;
  padding: 1px;
  background: var(--white);
}

.pie-table {
  border-collapse: collapse;
  font-size: var(--font-size-ms);
  width: 100%;
  min-width: 280px;
  background: var(--white);
}

.pie-table th,
.pie-table td {
  padding: 12px 16px;
  text-align: left;
  white-space: nowrap;
  vertical-align: middle;
}

.pie-table td:nth-child(2) {
  white-space: normal;
  word-break: break-word;
  max-width: 120px;
  min-width: 80px;
}

.pie-table th {
  background-color: var(--main01);
  color: var(--white) !important;
  font-weight: var(--font-weight-semi-bold);
  font-size: var(--font-size-ms);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: sticky;
  top: 0;
  z-index: 3;
}

.pie-table tbody tr:nth-child(even) {
  background-color: var(--main05);
}

.pie-table tbody tr:hover {
  background-color: var(--main01);
  color: var(--white);
  transition: background-color 0.2s ease;
}

.pie-table tbody tr {
  transition: all 0.2s ease;
}

@media (max-width: 768px) {
  .donut-chart-wrapper {
    max-width: 280px;
  }

  .donut-center-label {
    width: 85%;
  }

  .table-container {
    margin: 16px 0 0 0;
    border-radius: 8px;
  }

  .pie-table {
    font-size: var(--font-size-ms);
    min-width: 260px;
  }

  .pie-table th,
  .pie-table td {
    padding: 10px 12px;
  }

  .pie-table td:nth-child(2) {
    max-width: 100px;
    min-width: 70px;
  }

  .pie-table th {
    font-size: var(--font-size-sm);
    padding: 8px 12px;
  }
}

@media (max-width: 480px) {
  .donut-chart-wrapper {
    max-width: 240px;
  }

  .donut-center-label {
    width: 90%;
  }

  .table-container {
    margin: 12px 0 0 0;
    border-radius: 6px;
  }

  .pie-table {
    font-size: var(--font-size-sm);
    min-width: 240px;
  }

  .pie-table th,
  .pie-table td {
    padding: 8px 10px;
  }

  .pie-table td:nth-child(2) {
    max-width: 80px;
    min-width: 60px;
  }

  .pie-table th {
    font-size: var(--font-size-sm);
    padding: 6px 10px;
  }
}

@media (hover: none) and (pointer: coarse) {
  .donut-chart-wrapper {
    touch-action: manipulation;
  }
}
</style>

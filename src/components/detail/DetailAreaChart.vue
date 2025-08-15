<template>
  <div class="area-chart-wrapper">
    <div class="date-range-btns">
      <button
        v-for="(range, idx) in dateRanges"
        :key="range.label"
        :class="{ active: selectedRangeIdx === idx }"
        type="button"
        @click.stop.prevent="selectRange(idx)"
      >
        {{ range.label }}
      </button>
    </div>
    <div ref="chartContainer" class="chart-container" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from 'vue';
import { createChart } from 'lightweight-charts';

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  category: {
    type: String,
    default: 'fund'
  }
});

// CSS 변수를 실제 색상 값으로 변환하는 함수
const getComputedColor = (cssVariable) => {
  if (typeof window === 'undefined') return '#000000'; // SSR 환경에서는 기본값 반환
  
  try {
    const computedStyle = getComputedStyle(document.documentElement);
    return computedStyle.getPropertyValue(cssVariable).trim() || '#000000';
  } catch (error) {
    console.warn(`Failed to get computed color for ${cssVariable}:`, error);
    return '#000000';
  }
};

const chartContainer = ref(null);
const chart = ref(null);
const aumSeries = ref(null);
const yieldSeries = ref(null);
const selectedRangeIdx = ref(0);

const dateRanges = [
  { label: '1주', days: 7 },
  { label: '1개월', days: 30 },
  // { label: '3개월', days: 90 } // 잠시 사용 안함
];

const filteredData = computed(() => {
  try {
    if (!props.data || props.data.length === 0) return [];
    
    if (props.category === 'etf') {
      const selectedRange = dateRanges[selectedRangeIdx.value];
      
      const filtered = props.data
        .filter(d => {
          try {
            const dataDate = new Date(d.time * 1000);
            
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - (selectedRange.days + 2));
            
            return dataDate >= cutoffDate;
          } catch (error) {
            console.warn('Error processing ETF date:', error, d);
            return false;
          }
        });
      
      const result = filtered
        .filter(d => d && d.time && !isNaN(d.value))
        .sort((a, b) => a.time - b.time);
      
      return result;
    }
    
    const selectedRange = dateRanges[selectedRangeIdx.value];
    let returnField;
    
    if (selectedRange.days === 7) {
      returnField = 'weeklyReturn';
    } else if (selectedRange.days === 30) {
      returnField = 'monthlyReturn';
    }
    
    return props.data
      .filter(d => {
        try {
          let dataDate;
          
          if (d.baseDate && Array.isArray(d.baseDate)) {
            dataDate = new Date(d.baseDate[0], d.baseDate[1] - 1, d.baseDate[2]);
          } else if (d.baseDate) {
            dataDate = new Date(d.baseDate);
          } else if (d.date) {
            dataDate = new Date(d.date);
          } else if (d.timestamp) {
            dataDate = new Date(d.timestamp);
          } else {
            dataDate = new Date();
          }
          
          const cutoffDate = new Date();
          cutoffDate.setDate(cutoffDate.getDate() - (selectedRange.days + 2));
          return dataDate >= cutoffDate;
        } catch (error) {
          console.warn('Error processing date:', error, d);
          return false;
        }
      })
      .map(d => {
        try {
          let time, aum, yieldValue;
          
          if (d.baseDate && Array.isArray(d.baseDate)) {
            time = new Date(d.baseDate[0], d.baseDate[1] - 1, d.baseDate[2]).getTime() / 1000;
          } else if (d.baseDate) {
            time = new Date(d.baseDate).getTime() / 1000;
          } else if (d.date) {
            time = new Date(d.date).getTime() / 1000;
          } else if (d.timestamp) {
            time = Math.floor(d.timestamp / 1000);
          } else {
            time = Math.floor(Date.now() / 1000);
          }
          
          let aumValue = 0;
          if (d.fundAum !== undefined && d.fundAum !== null) {
            aumValue = Number(d.fundAum);
          } else if (d.fund_aum !== undefined && d.fund_aum !== null) {
            aumValue = Number(d.fund_aum);
          } else if (d.aum !== undefined && d.aum !== null) {
            aumValue = Number(d.aum);
          } else if (d.fundNav !== undefined && d.fundNav !== null) {
            aumValue = Number(d.fundNav);
          }
          
          aum = aumValue;
          
          yieldValue = Number(d[returnField]) || 0;
          
          const result = { time, aum, yield: yieldValue };
          
          return result;
        } catch (error) {
          console.warn('Error processing fund data item:', error, d);
          return null;
        }
      })
      .filter(d => d && d.time && !isNaN(d.aum) && !isNaN(d.yield))
      .sort((a, b) => a.time - b.time);
  } catch (error) {
    console.error('Error in filteredData computed:', error);
    return [];
  }
});

const updateChartSeries = () => {
  if (!chart.value) {
    console.warn('DetailAreaChart - Chart not initialized');
    return;
  }

  if (props.category === 'etf') {
    if (!yieldSeries.value) return;

    const yieldData = filteredData.value.map(d => ({ time: d.time, value: d.value }));

    if (yieldData.length >= 2) {
      try {
        yieldSeries.value.setData(yieldData);
        
        chart.value.timeScale().fitContent();
      } catch (error) {
        console.error('Error updating ETF chart series:', error);
      }
    } else {
      console.warn('DetailAreaChart - ETF: Not enough data to update chart. yieldData length:', yieldData.length);
    }
  } else {
    if (!aumSeries.value || !yieldSeries.value) return;

    const aumData = filteredData.value.map(d => ({ time: d.time, value: d.aum }));
    const yieldData = filteredData.value.map(d => ({ time: d.time, value: d.yield }));

    if (aumData.length >= 2) {
      try {
        aumSeries.value.setData(aumData);
        
        yieldSeries.value.setData(yieldData);
        
        if (aumData.length > 0) {
          const maxAum = Math.max(...aumData.map(d => d.value));
          const minAum = Math.min(...aumData.map(d => d.value));
          
          if (maxAum > 1000 && chart.value.rightPriceScale) {
            try {
              chart.value.rightPriceScale.applyOptions({
                autoScale: true,
                scaleMargins: {
                  top: 0.1,
                  bottom: 0.1
                }
              });
            } catch (error) {
              console.warn('Error applying fund rightPriceScale options:', error);
            }
          }
        }
        
        chart.value.timeScale().fitContent();
      } catch (error) {
        console.error('Error updating fund chart series:', error);
      }
    } else {
      console.warn('DetailAreaChart - Not enough data to update chart. aumData length:', aumData.length);
    }
  }
};

const selectRange = idx => {
  selectedRangeIdx.value = idx;
};

onMounted(() => {
  nextTick(() => {
    try {
      if (!chartContainer.value) return;

      chart.value = createChart(chartContainer.value, {
        layout: {
          background: { color: 'transparent' },
          textColor: getComputedColor('--main01')
        },
        grid: {
          vertLines: { style: 2, color: getComputedColor('--main04') },
          horzLines: { visible: false }
        },
        rightPriceScale: {
          visible: props.category === 'fund',
          borderColor: getComputedColor('--green01'),
          autoScale: true
        },
        leftPriceScale: {
          visible: true,
          borderColor: getComputedColor('--text-blue'),
          autoScale: true,
          scaleMargins: {
            top: 0.1,
            bottom: 0.1,
            left: 0,
            right: 0.1
          }
        },
        timeScale: {
          borderColor: getComputedColor('--main03'),
          timeVisible: true,
          secondsVisible: false,
          rightOffset: -1,
          barSpacing: 3,
          fixLeftEdge: true,
          lockVisibleTimeRangeOnResize: true,
          rightBarStaysOnScroll: true,
          borderVisible: false,
          visible: true,
          tickMarkFormatter: (time) => {
            const date = new Date(time * 1000);
            return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
          }
        },
        crosshair: {
          mode: 1
        },
        handleScroll: {
          mouseWheel: false,
          pressedMouseMove: false,
          horzTouchDrag: false,
          vertTouchDrag: false
        },
        handleScale: {
          axisPressedMouseMove: false,
          mouseWheel: false,
          pinch: false
        }
      });

      if (props.category === 'fund') {
        aumSeries.value = chart.value.addLineSeries({
          priceScaleId: 'right',
          color: getComputedColor('--green01'),
          lineWidth: 2
        });
      }

      yieldSeries.value = chart.value.addAreaSeries({
        priceScaleId: 'left',
        lineColor: getComputedColor('--text-blue'),
        topColor: 'rgba(37, 99, 235, 0.4)',
        bottomColor: 'rgba(37, 99, 235, 0)'
      });

      nextTick(() => {
        updateChartSeries();
      });
    } catch (error) {
      console.error('Error creating chart:', error);
    }
  });
});

watch(filteredData, () => {
  try {
    updateChartSeries();
  } catch (error) {
    console.error('Error in filteredData watcher:', error);
  }
}, { deep: true });

onUnmounted(() => {
  if (chart.value) {
    chart.value.remove();
    chart.value = null;
  }
});
</script>

<style scoped>
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
  border-radius: 20px; padding: 6px 14px; font-size: var(--font-size-ms);
  font-weight: 500; cursor: pointer;
}
.date-range-btns button.active {
  background: var(--main01); color: var(--white);
}
</style>
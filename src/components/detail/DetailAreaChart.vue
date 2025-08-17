<template>
  <div class="area-chart-wrapper">
    <div
      v-if="category === 'fund'"
      class="date-range-btns">
      <button
        v-for="(range, idx) in dateRanges"
        :key="range.label"
        :class="{ active: selectedRangeIdx === idx }"
        type="button"
        @click.stop.prevent="selectRange(idx)">
        {{ range.label }}
      </button>
    </div>

    <div
      v-if="category === 'etf' || category === 'fund'"
      class="chart-caption">
      <div
        v-if="category === 'etf'"
        class="caption-item">
        <div class="caption-color etf-price-color"></div>
        <span>시세</span>
      </div>
      <div
        v-if="category === 'etf'"
        class="caption-item">
        <div class="caption-color etf-volume-color"></div>
        <span>거래량</span>
      </div>

      <div
        v-if="category === 'fund'"
        class="caption-item">
        <div class="caption-color aum-color"></div>
        <span>운용규모</span>
      </div>
      <div
        v-if="category === 'fund'"
        class="caption-item">
        <div class="caption-color return-color"></div>
        <span>수익률</span>
      </div>
    </div>

    <div
      ref="chartContainer"
      class="chart-container" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from 'vue';
import { createChart } from 'lightweight-charts';

// 상수
const CHART_COLORS = {
  ETF: {
    PRICE: '#4CAF50',
    PRICE_ALPHA: 'rgba(76, 175, 80, 0.3)',
    PRICE_TRANSPARENT: 'rgba(76, 175, 80, 0.0)',
    VOLUME: 'rgba(255, 152, 0, 0.8)',
    VOLUME_AXIS: '#FF9800'
  },
  FUND: {
    AUM: '#10B981',
    AUM_ALPHA: 'rgba(16, 185, 129, 0.3)',
    AUM_TRANSPARENT: 'rgba(16, 185, 129, 0.0)',
    RETURN: '#2196F3',
    RETURN_ALPHA: 'rgba(33, 150, 243, 0.3)',
    RETURN_TRANSPARENT: 'rgba(33, 150, 243, 0.0)'
  }
};

const CHART_CONFIG = {
  HEIGHT: 320,
  MARGINS: {
    ETF_PRICE: { top: 0.8, bottom: 0.2 },
    ETF_VOLUME: { top: 0.8, bottom: 0 },
    FUND_AUM: { top: 0.3, bottom: 0 },
    FUND_RETURN: { top: 0.1, bottom: 0 }
  }
};

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  category: {
    type: String,
    default: 'fund'
  },
  realtimeData: {
    type: Object,
    default: null
  }
});

const chartContainer = ref(null);
const chart = ref(null);
const selectedRangeIdx = ref(0);
const etfPriceSeries = ref(null);
const etfVolumeSeries = ref(null);
const aumSeries = ref(null);
const returnSeries = ref(null);

const dateRanges = computed(() => {
  if (props.category === 'etf') return [];

  return [
    { label: '1주', days: 7 },
    { label: '1개월', days: 30 },
    { label: '3개월', days: 90 }
  ];
});

const processChartData = computed(() => {
  console.log('들어온 원본 데이터:', props.data);

  if (props.category === 'etf') {
    const etfData = props.data
      .sort((a, b) => {
        const timeA = a.timestamp || a.time || 0;
        const timeB = b.timestamp || b.time || 0;
        return timeA - timeB;
      })
      .slice(-60)
      .map(item => {
        let time;
        if (item.timestamp) {
          time = Math.floor(item.timestamp / 1000);
        } else if (item.time) {
          time = item.time;
        } else {
          time = Date.now() / 1000;
        }

        let price;
        if (item.currentPrice !== undefined) {
          price = Number(item.currentPrice) || 0;
        } else if (item.price !== undefined) {
          price = Number(item.price) || 0;
        } else {
          price = 0;
        }

        let volume;
        if (item.currentVolume !== undefined) {
          volume = Number(item.currentVolume) || 0;
        } else if (item.volume !== undefined) {
          volume = Number(item.volume) || 0;
        } else {
          volume = 0;
        }

        return {
          time: time,
          price: price,
          volume: volume,
          originalData: item
        };
      });

    console.log('ETF 처리 결과 개수:', etfData.length);
    console.log('ETF 처리 결과:', etfData);
    return etfData;
  } else {
    const selectedRange = dateRanges.value[selectedRangeIdx.value];

    let returnField;
    let daysToFilter;

    if (selectedRange.days === 7) {
      returnField = 'weeklyReturn';
      daysToFilter = 7;
    } else if (selectedRange.days === 30) {
      returnField = 'monthlyReturn';
      daysToFilter = 30;
    } else {
      returnField = 'quarterlyReturn';
      daysToFilter = 90;
    }

    const sortedData = props.data.sort((a, b) => new Date(a.baseDate) - new Date(b.baseDate));

    let filteredData;
    if (selectedRange.days === 7) {
      filteredData = sortedData.slice(-7);
    } else if (selectedRange.days === 30) {
      filteredData = sortedData.slice(-30);
    } else {
      filteredData = sortedData.slice(-90);
    }

    const result = {
      aum: filteredData.map(item => ({
        time: Math.floor(new Date(item.baseDate).getTime() / 1000),
        value: Number(item.fundAum) || 0,
        originalData: item
      })),
      returns: filteredData.map(item => ({
        time: Math.floor(new Date(item.baseDate).getTime() / 1000),
        value: Number(item[returnField]) || 0,
        originalData: item
      }))
    };

    console.log('Fund 처리 결과:', result);
    return result;
  }
});

const etfChartData = computed(() => (props.category === 'etf' ? processChartData.value : []));

const fundChartData = computed(() =>
  props.category === 'fund' ? processChartData.value : { aum: [], returns: [] }
);

const updateChartSeries = () => {
  try {
    if (!chart.value) return;

    if (props.category === 'etf') {
      if (etfPriceSeries.value) {
        const etfPriceData = etfChartData.value.slice(-60).map(item => ({
          time: item.time,
          value: item.price
        }));

        const etfVolumeData = etfChartData.value.slice(-60).map(item => ({
          time: item.time,
          value: item.volume
        }));

        etfPriceSeries.value.setData(etfPriceData);

        if (etfVolumeSeries.value) {
          etfVolumeSeries.value.setData(etfVolumeData);
        }

        if (etfChartData.value.length > 60) {
          const recentData = etfChartData.value.slice(-60);
          chart.value.timeScale().setVisibleRange({
            from: recentData[0]?.time,
            to: recentData[recentData.length - 1]?.time
          });
        } else {
          chart.value.timeScale().setVisibleRange({
            from: etfChartData.value[0]?.time,
            to: etfChartData.value[etfChartData.value.length - 1]?.time
          });
        }

        if (etfPriceData.length > 0) {
          const prices = etfPriceData.map(item => item.value);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          const priceRange = maxPrice - minPrice;

          const padding = priceRange * 0.01;
          const minValue = minPrice - padding;
          const maxValue = maxPrice + padding;

          chart.value.priceScale('left').applyOptions({
            autoScale: false,
            minValue: minValue,
            maxValue: maxValue,
            entireTextOnly: false,
            scaleMargins: {
              top: 0.3,
              bottom: 0.3
            }
          });
        }
      }
    } else {
      if (aumSeries.value && returnSeries.value) {
        console.log('Fund 차트에 전달되는 AUM 데이터:', fundChartData.value.aum);
        console.log('Fund 차트에 전달되는 Returns 데이터:', fundChartData.value.returns);
        aumSeries.value.setData(fundChartData.value.aum);
        returnSeries.value.setData(fundChartData.value.returns);

        chart.value.timeScale().fitContent();

        chart.value.priceScale('left').applyOptions({
          autoScale: true
        });

        chart.value.timeScale().setVisibleRange({
          from: fundChartData.value.returns[0]?.time,
          to: fundChartData.value.returns[fundChartData.value.returns.length - 1]?.time
        });
      }
    }
  } catch (error) {
    console.error('Error updating chart series:', error);
  }
};

// ETF 차트 생성 함수
const createEtfChart = () => {
  etfPriceSeries.value = chart.value.addAreaSeries({
    lineColor: CHART_COLORS.ETF.PRICE,
    topColor: CHART_COLORS.ETF.PRICE_ALPHA,
    bottomColor: CHART_COLORS.ETF.PRICE_TRANSPARENT,
    lineWidth: 2,
    crosshairMarkerVisible: false,
    lastValueVisible: false,
    priceLineVisible: false,
    priceScaleId: 'left',
    scaleMargins: CHART_CONFIG.MARGINS.ETF_PRICE
  });

  chart.value.priceScale('left').applyOptions({
    visible: true,
    borderColor: CHART_COLORS.ETF.PRICE,
    textColor: CHART_COLORS.ETF.PRICE,
    autoScale: false,
    scaleMargins: CHART_CONFIG.MARGINS.ETF_PRICE,
    entireTextOnly: false,
    ticksVisible: true,
    borderVisible: true
  });

  etfVolumeSeries.value = chart.value.addHistogramSeries({
    color: CHART_COLORS.ETF.VOLUME,
    priceFormat: { type: 'volume' },
    priceScaleId: 'right',
    scaleMargins: CHART_CONFIG.MARGINS.ETF_VOLUME
  });

  chart.value.priceScale('right').applyOptions({
    visible: true,
    borderColor: CHART_COLORS.ETF.VOLUME_AXIS,
    textColor: CHART_COLORS.ETF.VOLUME_AXIS,
    autoScale: true,
    scaleMargins: CHART_CONFIG.MARGINS.ETF_VOLUME
  });

  const etfPriceData = etfChartData.value.slice(-60).map(item => ({
    time: item.time,
    value: item.price
  }));

  const etfVolumeData = etfChartData.value.slice(-60).map(item => ({
    time: item.time,
    value: item.volume
  }));

  etfPriceSeries.value.setData(etfPriceData);
  etfVolumeSeries.value.setData(etfVolumeData);

  if (etfPriceData.length > 0) {
    const prices = etfPriceData.map(item => item.value);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    chart.value.priceScale('left').applyOptions({
      autoScale: false,
      minValue: minPrice,
      maxValue: maxPrice
    });
  }
};

const createChartOptions = () => {
  const chartOptions = {
    layout: {
      background: { color: 'transparent' },
      textColor: '#333333'
    },
    grid: {
      vertLines: { style: 2, color: '#E5E7EB' },
      horzLines: { visible: false }
    },
    leftPriceScale: {
      visible: true,
      borderColor: CHART_COLORS.ETF.PRICE,
      textColor: CHART_COLORS.ETF.PRICE,
      autoScale: true,
      scaleMargins: CHART_CONFIG.MARGINS.ETF_PRICE
    },
    timeScale: {
      borderColor: '#D1D5DB',
      timeVisible: true,
      secondsVisible: true,
      rightOffset: -1,
      barSpacing: 3,
      fixLeftEdge: true,
      lockVisibleTimeRangeOnResize: true,
      rightBarStaysOnScroll: false,
      borderVisible: false,
      visible: true,
      scrollBehavior: 'smooth',
      scrollable: false,
      tickMarkFormatter: time => {
        const date = new Date(time * 1000);
        if (props.category === 'etf') {
          return date.toLocaleTimeString('ko-KR', {
            minute: '2-digit',
            second: '2-digit'
          });
        }
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
  };

  if (props.category === 'etf' || props.category === 'fund') {
    chartOptions.rightPriceScale = {
      visible: true,
      borderColor: props.category === 'etf' ? CHART_COLORS.ETF.VOLUME_AXIS : CHART_COLORS.FUND.AUM,
      textColor: props.category === 'etf' ? CHART_COLORS.ETF.VOLUME_AXIS : CHART_COLORS.FUND.AUM,
      autoScale: true
    };
  }

  return chartOptions;
};

const createFundChart = () => {
  aumSeries.value = chart.value.addAreaSeries({
    lineColor: CHART_COLORS.FUND.AUM,
    topColor: CHART_COLORS.FUND.AUM_ALPHA,
    bottomColor: CHART_COLORS.FUND.AUM_TRANSPARENT,
    lineWidth: 2,
    crosshairMarkerVisible: false,
    lastValueVisible: false,
    priceLineVisible: false,
    priceScaleId: 'right'
  });

  returnSeries.value = chart.value.addAreaSeries({
    lineColor: CHART_COLORS.FUND.RETURN,
    topColor: CHART_COLORS.FUND.RETURN_ALPHA,
    bottomColor: CHART_COLORS.FUND.RETURN_TRANSPARENT,
    lineWidth: 2,
    crosshairMarkerVisible: false,
    lastValueVisible: false,
    priceLineVisible: false,
    priceScaleId: 'left'
  });

  chart.value.priceScale('right').applyOptions({
    visible: true,
    borderColor: CHART_COLORS.FUND.AUM,
    textColor: CHART_COLORS.FUND.AUM,
    autoScale: true,
    scaleMargins: CHART_CONFIG.MARGINS.FUND_AUM
  });

  chart.value.priceScale('left').applyOptions({
    visible: true,
    borderColor: CHART_COLORS.FUND.RETURN,
    textColor: CHART_COLORS.FUND.RETURN,
    autoScale: true,
    entireTextOnly: false,
    scaleMargins: CHART_CONFIG.MARGINS.FUND_RETURN
  });

  aumSeries.value.setData(fundChartData.value.aum);
  returnSeries.value.setData(fundChartData.value.returns);

  chart.value.timeScale().fitContent();
};

const selectRange = idx => {
  if (props.category !== 'fund') return;

  selectedRangeIdx.value = idx;

  nextTick(() => {
    updateChartSeries();
  });
};

onMounted(() => {
  nextTick(() => {
    try {
      if (!chartContainer.value) return;

      const chartOptions = createChartOptions();

      chart.value = createChart(chartContainer.value, chartOptions);

      if (props.category === 'etf') {
        createEtfChart();
      } else {
        createFundChart();
      }

      nextTick(() => {
        updateChartSeries();
      });
    } catch (error) {
      console.error('Error creating chart:', error);
    }
  });
});

watch(
  processChartData,
  () => {
    try {
      updateChartSeries();
    } catch (error) {
      console.error('Error in processChartData watcher:', error);
    }
  },
  { deep: true }
);

watch(
  () => props.realtimeData,
  newRealtimeData => {
    if (props.category === 'etf' && newRealtimeData && chart.value) {
      try {
        console.log('=== 웹소켓 실시간 데이터 감지 ===');
        console.log('새로운 실시간 데이터:', newRealtimeData);

        if (
          newRealtimeData.timestamp &&
          newRealtimeData.currentPrice !== undefined &&
          newRealtimeData.currentVolume !== undefined
        ) {
          const newTime = Math.floor(newRealtimeData.timestamp / 1000);
          const newPrice = Number(newRealtimeData.currentPrice) || 0;
          const newVolume = Number(newRealtimeData.currentVolume) || 0;

          console.log('변환된 실시간 데이터:', {
            time: newTime,
            price: newPrice,
            volume: newVolume
          });

          if (etfPriceSeries.value) {
            etfPriceSeries.value.update({
              time: newTime,
              value: newPrice
            });
            console.log('가격 시리즈 업데이트 완료');
          }

          if (etfVolumeSeries.value) {
            etfVolumeSeries.value.update({
              time: newTime,
              value: newVolume
            });
            console.log('거래량 시리즈 업데이트 완료');
          }

          const currentVisibleRange = chart.value.timeScale().getVisibleRange();
          if (currentVisibleRange && currentVisibleRange.from && currentVisibleRange.to) {
            const timeRange = currentVisibleRange.to - currentVisibleRange.from;
            if (timeRange > 60) {
              const newFrom = currentVisibleRange.to - 60;
              chart.value.timeScale().setVisibleRange({
                from: newFrom,
                to: currentVisibleRange.to
              });
              console.log('실시간 업데이트 시 시간축 범위 조정:', {
                from: new Date(newFrom * 1000).toLocaleTimeString(),
                to: new Date(currentVisibleRange.to * 1000).toLocaleTimeString()
              });
            }
          } else {
            const newTo = Math.floor(Date.now() / 1000);
            const newFrom = newTo - 60;
            chart.value.timeScale().setVisibleRange({
              from: newFrom,
              to: newTo
            });
            console.log('초기 시간축 범위 설정:', {
              from: new Date(newFrom * 1000).toLocaleTimeString(),
              to: new Date(newTo * 1000).toLocaleTimeString()
            });
          }

          const timeScaleInfo = chart.value.timeScale().getVisibleRange();
          console.log('차트 상태 - timeScale visibleRange:', timeScaleInfo);
        }
      } catch (error) {
        console.error('Error updating realtime data:', error);
      }
    }
  },
  { deep: true }
);

watch(selectedRangeIdx, () => {
  if (props.category === 'fund') {
    try {
      updateChartSeries();
    } catch (error) {
      console.error('Error in selectedRangeIdx watcher:', error);
    }
  }
});

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
  box-sizing: border-box;
}

.area-chart-wrapper {
  width: 100%;
  padding: 0;
  overflow: visible;
  box-sizing: border-box;
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
  font-size: var(--font-size-ms);
  font-weight: 500;
  cursor: pointer;
}

.date-range-btns button.active {
  background: var(--main01);
  color: var(--white);
}

.chart-caption {
  display: flex;
  justify-content: space-around;
  margin-bottom: 16px;
  padding: 8px 12px;
  background-color: #f3f4f6;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  width: 100%;
  box-sizing: border-box;
}

.caption-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.caption-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.aum-color {
  background-color: #10b981; /* AUM 색상 */
}

.return-color {
  background-color: #2196f3; /* 수익률 색상 */
}

.etf-price-color {
  background-color: #4caf50; /* ETF 가격 색상 */
}

.etf-volume-color {
  background-color: rgba(255, 152, 0, 0.8); /* ETF 거래량 색상 (투명도 포함) */
}
</style>

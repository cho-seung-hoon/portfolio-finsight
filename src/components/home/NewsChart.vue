<template>
  <div class="subBox">
    <div class="subItem">
      <div class="subItem-left">
        <div class="subItem-title01">뉴스 키워드</div>

        <div
          class="icon-wrapper icon-question"
          @click="showTooltip = !showTooltip">
          <IconQuestion />

          <Transition name="tooltip">
            <div
              v-if="showTooltip"
              class="tooltip-content">
              최근 7일 뉴스레터의 감성분석 결과입니다.
              <br/><br/>
              <div class="tooltip-content-sentiment">
                <div class="sentiment">
                  <div class="icon-wrapper icon-positive">
                    <IconSquare/>
                  </div>
                  긍정
                </div>
                <div class="sentiment">
                  <div class="icon-wrapper icon-neutral">
                    <IconSquare/>
                  </div>
                  중립
                </div>
                <div class="sentiment">
                  <div class="icon-wrapper icon-negative">
                    <IconSquare/>
                  </div>
                  부정
                </div>
              </div>
              <br/>
              ※ 투자 시 참고 자료로만 활용해 주세요.
            </div>
          </Transition>
        </div>

      </div>
      <div class="subItem-right">
        <div class="subItem-title02">지난 7일 집계</div>
        <div class="icon-wrapper icon-refresh" @click="handleRefreshClick">
          <IconRefresh/>
        </div>
      </div>
    </div>
    <div
      ref="chartBox"
      class="chartBox"></div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, watch } from 'vue';
import * as d3 from 'd3';
import IconQuestion from '@/components/icons/IconQuestion.vue';
import IconRefresh from '@/components/icons/IconRefresh.vue';
import IconSquare from '@/components/icons/IconSquare.vue';

// ===================================================================
// ✨ 1. 로직 영역 (Logic Area)
// ===================================================================

const props = defineProps({
  chartData: {
    type: Array,
    required: true
  }
});
const emit = defineEmits(['keyword-click', 'initial-load', 'refresh-data']);

const chartBox = ref(null);
const showTooltip = ref(false);
const initialLoadDone = ref(false);
let svg, simulation, resizeObserver;

function handleRefreshClick() {
  emit('refresh-data');
}

// 이벤트 핸들러
function onBubbleClick(keyword) {
  let colorToEmit;
  if (keyword.value > 5) {
    colorToEmit = keyword.color;
  } else {
    const textColorsForSentiment = sentimentTextColors[keyword.sentiment];
    colorToEmit = textColorsForSentiment[1];
  }
  emit('keyword-click', {
    label: keyword.label,
    color: colorToEmit,
    id: keyword.id
  });
}

// 데이터 변경 감지 및 생명주기 훅
watch(
  () => props.chartData,
  newData => {
    if (newData && newData.length > 0 && chartBox.value) {
      const container = chartBox.value;

      function resize() {
        const width = container.clientWidth;
        const height = width * 0.6;
        drawChart(newData, width, height);
      }

      if (!initialLoadDone.value) {
        const maxNode = newData.reduce((a, b) => (a.value > b.value ? a : b));
        const { bgColor } = colorScale(maxNode.value, maxNode.sentiment);
        emit('initial-load', {
          id: maxNode.id,
          label: maxNode.label,
          color: bgColor
        });
        initialLoadDone.value = true;
      }
      resize();
      if (resizeObserver) resizeObserver.disconnect();
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);
    }
  },
  { deep: true }
);

onBeforeUnmount(() => {
  if (resizeObserver) resizeObserver.disconnect();
  if (simulation) simulation.stop();
});

// ===================================================================
// ✨ 2. 차트 설정 및 구현 영역 (Chart Settings & Implementation)
// ===================================================================

// --- 색상 설정 ---
const sentimentColors = {
  negative: ['#f4dcd6', '#FC8675', '#f97662'],
  neutral: ['#e2e4d8', '#e2e4d8', '#e2e4d8'],
  positive: ['#ccddf8', '#6B96E0', '#6c8fe8']
};
const sentimentTextColors = {
  negative: ['#5E2720', '#9c3428', '#FFFFFF'],
  neutral: ['#7c7c77', '#7c7c77', '#7c7c77'],
  positive: ['#1D2C45', '#1a418e', '#FFFFFF']
};

// --- 헬퍼 함수 ---
function colorScale(value, sentiment) {
  let index;
  if (value > 15) index = 2;
  else if (value > 5) index = 1;
  else index = 0;

  return {
    bgColor: sentimentColors[sentiment][index],
    textColor: sentimentTextColors[sentiment][index]
  };
}

// --- 차트 그리기 메인 함수 ---
function drawChart(data, width, height) {
  if (!data || data.length === 0) return;

  d3.select(chartBox.value).selectAll('*').remove();

  svg = d3.select(chartBox.value).append('svg').attr('width', width).attr('height', height);

  const radiusScale = d3
    .scaleSqrt()
    .domain([d3.min(data, d => d.value), d3.max(data, d => d.value)])
    .range([25, 40]); // 버블 크기 조절

  const fontSizeScale = d3.scaleLinear().domain(radiusScale.range()).range([11, 15]).clamp(true);

  function wrap(textSelection) {
    textSelection.each(function (d) {
      const text = d3.select(this);
      const label = d.label;
      const maxWidth = d.r * 1.7;
      const lineHeight = 1.2;
      const y = text.attr('y') || 0;
      const currentFontSize = fontSizeScale(d.r);

      text.text(label);
      const textWidth = this.getComputedTextLength();

      if (textWidth < maxWidth) {
        text.text(null).append('tspan').attr('x', 0).attr('dy', '0.35em').text(label);
        return;
      }

      text.text(null);
      const midPoint = Math.floor(label.length / 2);
      const line1 = label.substring(0, midPoint);
      const line2 = label.substring(midPoint);

      text.append('tspan').attr('x', 0).attr('y', y).text(line1);

      text.append('tspan').attr('x', 0).attr('y', y).attr('dy', `${lineHeight}em`).text(line2);

      const verticalOffset = -(lineHeight / 2) * (currentFontSize * 0.5);
      text.attr('transform', `translate(0, ${verticalOffset})`);
    });
  }

  const nodes = data.map(d => {
    const { bgColor, textColor } = colorScale(d.value, d.sentiment);
    return {
      ...d,
      label: d.label.toUpperCase(),
      r: radiusScale(d.value),
      x: width / 2,
      y: height / 2,
      color: bgColor,
      textColor: textColor
    };
  });

  const g = svg.append('g').selectAll('g').data(nodes).enter().append('g');

  const bubble = g
    .append('g')
    .style('cursor', 'pointer')
    .on('click', (event, d) => onBubbleClick(d));

  bubble
    .append('circle')
    .attr('r', 0)
    .attr('fill', d => d.color)
    .transition()
    .duration(800)
    .ease(d3.easeBackOut)
    .attr('r', d => d.r);

  bubble
    .append('text')
    .attr('text-anchor', 'middle')
    .style('font-size', d => `${fontSizeScale(d.r)}px`)
    .style('font-weight', '600')
    .style('fill', d => d.textColor)
    .style('opacity', 0)
    .call(wrap)
    .transition()
    .duration(800)
    .style('opacity', 1);

  simulation = d3
    .forceSimulation(nodes)
    .force('charge', d3.forceManyBody().strength(5))
    .force(
      'collision',
      d3
        .forceCollide()
        .radius(d => d.r + 2)
        .iterations(2)
    )
    .force('x', d3.forceX(width / 2).strength(0.1))
    .force('y', d3.forceY(height * 0.5).strength(0.2))
    .on('tick', () => {
      nodes.forEach(d => {
        d.x = Math.max(d.r, Math.min(width - d.r, d.x));
        d.y = Math.max(d.r, Math.min(height - d.r, d.y));
      });
      g.attr('transform', d => `translate(${d.x},${d.y})`);
    });
}
</script>

<style scoped>
.subBox {
  position: relative;
}

.chartBox {
  background-color: var(--white);
  border: 1px solid var(--main04);
  border-radius: 8px;
  min-height: 200px;
  padding: 5px;
}

.subItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 5px;
}

.subItem-left {
  display: flex;
  align-items: center;
  gap: 5px;
}

.subItem-right {
  display: flex;
  align-items: center;
  gap: 5px;
}

.subItem-title01 {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
}

.subItem-title02 {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-light);
  color: var(--main02);
}

.icon-wrapper {
  cursor: pointer;
  width: 20px;
  height: 20px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-question {
  color: var(--main02);
}

.icon-refresh {
}

.icon-neutral {
  color: var(--newsNeutral);
}

.icon-negative {
  color: var(--newsNegative);
}

.icon-positive {
  color: var(--newsPositive);

}

.tooltip-content {
  position: absolute;
  top: -100%;
  left: calc(100% + 10px);
  transform: translateY(-50%);
  width: max-content;
  max-width: 250px;
  padding: 10px 15px;
  white-space: normal;
  word-break: keep-all;
  border-radius: 8px;
  background-color: rgb(from var(--main01) r g b / 0.85);
  color: var(--white);
  font-size: var(--font-size-sm);
  z-index: 1;
  justify-items: center;
}

.tooltip-content::after {
  content: '';
  position: absolute;
  top: 83%;
  right: 100%;
  transform: translateY(-50%);
  border-width: 6px;
  border-style: solid;
  border-color: transparent rgb(from var(--main01) r g b / 0.85) transparent transparent;
}

.tooltip-content-sentiment{
  display:flex;
  align-items: center;
  gap:10px;
}

.sentiment{
  display:flex;
  align-items:center;
  gap:5px;
}
.tooltip-enter-active,
.tooltip-leave-active {
  transition: opacity 0.2s ease-out;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
}

:deep(.chartBox svg g > circle) {
  transition: all 0.05s ease-out;
}

:deep(.chartBox svg g:active > circle) {
  transform: scale(0.95);
  filter: brightness(0.9);
}
</style>

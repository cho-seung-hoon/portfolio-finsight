<template>
  <div class="subBox">
    <div class="subItem">
      <div class="subItem-left">
        <div class="subItem-title01">뉴스 키워드</div>
        <div
          class="icon-wrapper icon-question"
          @click="showTooltip = !showTooltip">
          <IconQuestion />
        </div>
        <div
          v-if="showTooltip"
          class="tooltip-content">
          각 키워드의 언급량과 긍/부정 감성을 나타냅니다.
        </div>

      </div>
      <div class="subItem-right">
        <div class="subItem-title02">지난 7일 집계</div>
        <div class="icon-wrapper icon-refresh">
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

// ===================================================================
// ✨ 1. 로직 영역 (Logic Area)
// 컴포넌트의 상태, props, emit, 생명주기 등 핵심 로직을 모아둡니다.
// ===================================================================

const props = defineProps({
  chartData: {
    type: Array,
    required: true
  }
});
const emit = defineEmits(['keyword-click', 'initial-load']);

const chartBox = ref(null);
const showTooltip = ref(false);
const initialLoadDone = ref(false);
let svg, simulation, resizeObserver;

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
watch(() => props.chartData, (newData) => {
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
}, { deep: true });

onBeforeUnmount(() => {
  if (resizeObserver) resizeObserver.disconnect();
  if (simulation) simulation.stop();
});


// ===================================================================
// ✨ 2. 차트 설정 및 구현 영역 (Chart Settings & Implementation)
// D3.js 차트 구현에 필요한 세부 함수와 색상 설정 등을 모아둡니다.
// ===================================================================

// --- 색상 설정 ---
const sentimentColors = {
  negative: ['#f4dcd6', '#FC8675', '#f97662'],
  neutral: ['#edf4ce', '#d8f18c', '#bee136'],
  positive: ['#ccddf8', '#6B96E0', '#6c8fe8']
};
const sentimentTextColors = {
  negative: ['#5E2720', '#9c3428', '#FFFFFF'],
  neutral: ['#4F592A', '#748c1a', '#FFFFFF'],
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

function wrap(textSelection) {
  textSelection.each(function(d) {
    const text = d3.select(this);
    const label = d.label;
    const maxWidth = d.r * 1.7;
    const lineHeight = 1.2;
    const y = text.attr("y") || 0;

    text.style('font-size', '12px').style('font-weight', '600');
    const textWidth = this.getComputedTextLength();

    text.text(null);

    if (textWidth < maxWidth) {
      text.append('tspan')
        .attr('x', 0)
        .attr('dy', '0.35em')
        .text(label);
      return;
    }


    const midPoint = Math.floor(label.length / 2);
    const line1 = label.substring(0, midPoint);
    const line2 = label.substring(midPoint);

    text.append('tspan')
      .attr('x', 0)
      .attr('y', y)
      .text(line1);

    text.append('tspan')
      .attr('x', 0)
      .attr('y', y)
      .attr('dy', `${lineHeight}em`)
      .text(line2);


    const verticalOffset = -(lineHeight / 2) * 6;
    text.attr("transform", `translate(0, ${verticalOffset})`);
  });
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
    .style('font-size', '12px') // 기본 폰트 크기 고정
    .style('font-weight', '600')
    .style('fill', d => d.textColor)
    .style('opacity', 0)
    .text(d => d.label) // 먼저 전체 텍스트를 넣고
    .call(wrap) // wrap 함수를 호출하여 줄바꿈 적용
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
        .radius(d => d.r + 2) // 버블 간 간격 조절
        .iterations(2)
    )
    .force('x', d3.forceX(width / 2).strength(0.1))
    .force('y', d3.forceY(height * 0.5).strength(0.2))
    .on('tick', () => {
      // 버블이 경계를 넘어가지 않도록 위치 제한
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
  min-height: 200px; /* 차트 영역의 최소 높이 설정 */
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
  align-items:center;
  gap: 5px;
}

.subItem-right {
  display: flex;
  align-items:center;
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
  width:20px;
  height:20px;
}

.icon-question{
  color:var(--main02);
}

.icon-refresh{
}


.tooltip-content {
  position: absolute;
  top: 30px;
  left: 78px;
  padding: 8px 12px;
  border-radius: 6px;
  background-color: rgb(from var(--main01) r g b / 0.7);
  color: var(--white);
  font-size: var(--font-size-sm);
  white-space: nowrap;
  z-index: 10;
}

.tooltip-content::after {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 10px;
  border: 6px solid;
  border-color: transparent transparent var(--main02) transparent;
}

:deep(.chartBox svg g > circle) {
  transition: all 0.05s ease-out;
}

:deep(.chartBox svg g:active > circle) {
  transform: scale(0.95);
  filter: brightness(0.9);
}
</style>

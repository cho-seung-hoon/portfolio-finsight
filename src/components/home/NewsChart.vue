<template>
  <div class="subBox">
    <div class="subItem">
      <div class="subItem-left">
        <div class="subItem-title01">뉴스 키워드</div>
        <div class="subItem-title02">지난 7일 집계</div>
      </div>
      <div class="subItem-right">
        <div
          class="icon-wrapper"
          @click="showTooltip = !showTooltip">
          <IconQuestion />
        </div>
        <div
          v-if="showTooltip"
          class="tooltip-content">
          각 키워드의 언급량과 긍/부정 감성을 나타냅니다.
        </div>
      </div>
    </div>
    <div
      ref="chartBox"
      class="chartBox"></div>
  </div>
</template>

<script setup>
import IconQuestion from '@/components/icons/IconQuestion.vue';
import { ref, onBeforeUnmount, watchEffect } from 'vue';
import * as d3 from 'd3';

const props = defineProps({
  chartData: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['keyword-click']);

const showTooltip = ref(false);

function onBubbleClick(keyword) {
  emit('keyword-click', {
    label: keyword.label,
    color: keyword.color
  });
}

const chartBox = ref(null);
let svg, simulation, resizeObserver;

function colorScale(value, sentiment) {
  const sentimentColors = {
    positive: ['#fdd5d9', '#fca2b0', '#ec3a5a'],
    neutral: ['#fff3d0', '#fcd978', '#fab809'],
    negative: ['#d1f5f3', '#6ee5de', '#10b9b2']
  };

  const sentimentTextColors = {
    positive: ['#800000', '#b30000', '#ffffff'],
    neutral: ['#664400', '#996600', '#ffffff'],
    negative: ['#004444', '#007777', '#ffffff']
  };

  let index = 0;
  if (value > 3) index = 2;
  else if (value > 1) index = 1;
  else index = 0;

  return {
    bgColor: sentimentColors[sentiment][index],
    textColor: sentimentTextColors[sentiment][index]
  };
}

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
    .text(d => d.label)
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .style('font-size', '0px')
    .style('opacity', 0)
    .style('font-weight', '600')
    .style('fill', d => d.textColor)
    .transition()
    .duration(800)
    .ease(d3.easeBackOut)
    .style('opacity', 1)
    .style('font-size', d => Math.max(d.r / 3, 10) + 'px');

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

watchEffect(() => {
  if (props.chartData && props.chartData.length > 0 && chartBox.value) {
    const container = chartBox.value;

    const maxNode = props.chartData.reduce((a, b) => (a.value > b.value ? a : b));
    const { bgColor } = colorScale(maxNode.value, maxNode.sentiment);

    emit('keyword-click', {
      label: maxNode.label,
      color: bgColor
    });

    function resize() {
      const width = container.clientWidth;
      const height = width * 0.6;
      drawChart(props.chartData, width, height);
    }

    resize();

    if (resizeObserver) resizeObserver.disconnect();
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
  }
});

onBeforeUnmount(() => {
  if (resizeObserver) resizeObserver.disconnect();
  if (simulation) simulation.stop();
});
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
  align-items: flex-end;
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

.subItem-right {
  display: flex;
  justify-content: center;
  width: 20px;
}

.icon-wrapper {
  cursor: pointer; /* 클릭할 수 있다는 것을 알려줍니다 */
}

.tooltip-content {
  position: absolute;
  top: 30px;
  right: 0px;
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
  right: 10px;
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

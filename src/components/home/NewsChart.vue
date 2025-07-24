<template>
  <div class="subBox">
    <div class="subItem">
      <div class="subItem-title01">뉴스 키워드</div>
      <div class="subItem-title02">지난 7일 집계</div>
    </div>
    <div ref="chartBox" class="chartBox"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, defineEmits, defineProps, watchEffect } from 'vue';
import * as d3 from 'd3';

const props = defineProps({
  chartData: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['keyword-click']);

function onBubbleClick(keyword){
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
    neutral:  ['#fff3d0', '#fcd978', '#fab809'],
    negative: ['#d1f5f3', '#6ee5de', '#10b9b2'],
  };

  const sentimentTextColors = {
    positive: ['#800000', '#b30000', '#ffffff'], // 각 배경색에 대응
    neutral:  ['#664400', '#996600', '#ffffff'],
    negative: ['#004444', '#007777', '#ffffff'],
  };

  let index = 0;
  if (value > 3) index = 2;
  else if (value > 1) index = 1;
  else index = 0;

  return {
    bgColor: sentimentColors[sentiment][index],
    textColor: sentimentTextColors[sentiment][index],
  };
}



function drawChart(data, width, height) {
  if (!data || data.length === 0) return;

  d3.select(chartBox.value).selectAll('*').remove();

  svg = d3.select(chartBox.value)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const radiusScale = d3.scaleSqrt()
    .domain([d3.min(data, d => d.value), d3.max(data, d => d.value)])
    .range([20, 45]);


  const nodes = data.map(d => {
    const { bgColor, textColor } = colorScale(d.value, d.sentiment);
    return {
      ...d,
      r: radiusScale(d.value),
      x: width / 2,
      y: height / 2,
      color: bgColor,
      textColor: textColor
    }
  });

  simulation = d3.forceSimulation(nodes)
    .force('charge', d3.forceManyBody().strength(5))
    .force('collision', d3.forceCollide().radius(d => d.r + 3).iterations(2))
    .force('x', d3.forceX(width / 2).strength(0.1))
    .force('y', d3.forceY(height * 0.5).strength(0.2))
    .stop();

  for (let i = 0; i < 300; i++) simulation.tick();

  const g = svg.append('g');

  const bubble = g.selectAll('g')
    .data(nodes)
    .enter()
    .append('g')
    .attr('transform', d => `translate(${d.x},${d.y})`)
    .style('cursor', 'pointer')
    .on('click', (event, d) => onBubbleClick(d));

  bubble.append('circle')
    .attr('r', 0)
    .attr('fill', d => d.color)
    .transition()
    .duration(800)
    .ease(d3.easeBackOut)
    .attr('r', d => d.r);


  bubble.append('text')
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


}

watchEffect(() => {
  // props.chartData가 준비되고, chartBox ref가 연결되었을 때만 실행
  if (props.chartData && props.chartData.length > 0 && chartBox.value) {
    const container = chartBox.value;

    // 가장 큰 값을 가진 노드를 찾아 초기에 부모에게 알려줌
    const maxNode = props.chartData.reduce((a, b) => (a.value > b.value ? a : b));
    const { bgColor } = colorScale(maxNode.value, maxNode.sentiment);

    emit('keyword-click', {
      label: maxNode.label,
      color: bgColor
    });

    // 리사이즈 될 때마다 차트를 다시 그리는 함수
    function resize() {
      const width = container.clientWidth;
      const height = width * 0.6;
      // props로 받은 chartData를 사용해 차트를 그림
      drawChart(props.chartData, width, height);
    }

    resize(); // 최초 실행

    // 리사이즈 이벤트를 감지하여 resize 함수 실행
    if (resizeObserver) resizeObserver.disconnect(); // 기존 옵저버 연결 해제
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
.chartBox {
  background-color: var(--white);
  border:1px solid var(--main04);
  border-radius: 8px;
}

.subItem{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 5px;
}

.subItem-title01{
  font-size:var(--font-size-md);
  font-weight: var(--font-weight-bold);
}

.subItem-title02{
  font-size:var(--font-size-sm);
  font-weight: var(--font-weight-right);
  color:var(--main02);
}
</style>
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
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as d3 from 'd3';

const chartBox = ref(null);
let svg, simulation, resizeObserver;

const data = [
  { label: '트럼프', sentiment: 'positive', value: 60 },
  { label: 'TSLQ', sentiment: 'neutral', value: 50 },
  { label: '관세', sentiment: 'negative', value: 10 },
  { label: 'VOO', sentiment: 'neutral', value: 30 },
  { label: 'SPY', sentiment: 'positive', value: 30 }
];

function colorScale(value, sentiment) {
  const norm = Math.min(value / 100, 1);
  const scaled = Math.log1p(norm * 9) / Math.log(10);

  let baseColor;
  if (sentiment === 'positive') baseColor = d3.hsl('#ec3a5a');
  else if (sentiment === 'neutral') baseColor = d3.hsl('#fab809');
  else baseColor = d3.hsl('#10b9b2');

  const minL = 0.5;   // 더 진한 최저 명도
  const maxL = 0.9;   // 더 연한 최고 명도

  const lightness = maxL - scaled * (maxL - minL);

  return d3.hsl(baseColor.h, baseColor.s, lightness).toString();
}

function getContrastTextColor(bgColor) {
  const hsl = d3.hsl(bgColor);

  const minTextL = 0.15;  // 텍스트 명도 최저 (진한 검정)
  const maxTextL = 0.35;  // 텍스트 명도 최고 (밝은 검정)

  let invertedL = maxTextL - hsl.l * (maxTextL - minTextL);

  invertedL = Math.min(Math.max(invertedL, minTextL), maxTextL);

  const sat = Math.min(hsl.s * 1.2, 1);

  return d3.hsl(hsl.h, sat, invertedL).toString();
}

function drawChart(width, height) {
  d3.select(chartBox.value).selectAll('*').remove();

  svg = d3.select(chartBox.value)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const radiusScale = d3.scaleSqrt()
    .domain([d3.min(data, d => d.value), d3.max(data, d => d.value)])
    .range([15, 50]);


  const nodes = data.map(d => {
    const color = colorScale(d.value, d.sentiment);
    const textColor = getContrastTextColor(color);
    // console.log(`버블: ${d.label} - 버블색: ${color}, 텍스트색: ${textColor}`);
    return{
      ...d,
      r: radiusScale(d.value),
      x: width / 2,
      y: height / 2,
      color: colorScale(d.value, d.sentiment)
    }});

  simulation = d3.forceSimulation(nodes)
    // .force('center', d3.forceCenter(width / 2, height / 2))
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
    .on('click', (event, d) => console.log(`클릭 : ${d.label}`));

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
    // 초기 상태: 글씨 크기 0, 투명도 0
    .style('font-size', '0px')
    .style('opacity', 0)
    .style('font-weight', '600')
    .style('fill', d => getContrastTextColor(d.color))
    // 애니메이션 적용
    .transition()
    .duration(800)
    .ease(d3.easeBackOut)
    .style('opacity', 1)
    .style('font-size', d => Math.max(d.r / 3, 10) + 'px');


}

onMounted(() => {
  const container = chartBox.value;

  function resize() {
    const width = container.clientWidth;
    const height = width * 0.6;
    drawChart(width, height);
  }

  resize();

  resizeObserver = new ResizeObserver(() => {
    resize();
  });
  resizeObserver.observe(container);
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
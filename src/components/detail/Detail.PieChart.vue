<template>
  <div>
    <div ref="chart" class="pie-chart"></div>
    <table class="pie-table">
      <thead>
        <tr>
          <th>색</th>
          <th>항목</th>
          <th>비중(%)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in standardizedData" :key="row.label">
          <td>
            <span :style="{ display: 'inline-block', width: '16px', height: '16px', 'border-radius': '50%', background: colorList[idx % colorList.length] }"></span>
          </td>
          <td>{{ row.label }}</td>
          <td>{{ row.value }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';

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

const chart = ref(null);
const colorList = ['#5B6CFF', '#A9B6FF', '#E5E8F6'];

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

const drawChart = () => {
  const width = 180;
  const height = 180;
  const radius = Math.min(width, height) / 2;
  d3.select(chart.value).selectAll('*').remove();
  const svg = d3.select(chart.value)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`);
  const tip = d3Tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(d => {
      if (!d || !d.data) return '';
      return `<b>${d.data.label ?? ''}</b><br/>${d.data.value ?? ''}%`;
    });
  svg.call(tip);
  const color = d3.scaleOrdinal()
    .domain(standardizedData.value.map(d => d.label))
    .range(colorList);
  const pie = d3.pie()
    .value(d => d.value);
  const data_ready = pie(standardizedData.value);
  svg
    .selectAll('path')
    .data(data_ready)
    .join('path')
    .attr('d', d3.arc()
      .innerRadius(60)
      .outerRadius(radius)
    )
    .attr('fill', d => color(d.data.label))
    .attr('stroke', 'white')
    .style('stroke-width', '2px')
    .on('mouseover', function(event, d) { tip.show.call(this, d, event); })
    .on('mousemove', function(event) {
      d3.select('.d3-tip')
        .style('left', (event.clientX + 10) + 'px')
        .style('top', (event.clientY - 10) + 'px');
    })
    .on('mouseout', function(event, d) { tip.hide.call(this, d, event); });
  // 중앙 텍스트 (가장 큰 비중)
  if (standardizedData.value.length > 0) {
    const main = standardizedData.value.reduce((a, b) => a.value > b.value ? a : b);
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 0)
      .attr('dy', '0em')
      .attr('font-size', '28px')
      .attr('font-weight', 'bold')
      .attr('fill', '#222')
      .text(`${main.value}%`);
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 24)
      .attr('dy', '0em')
      .attr('font-size', '15px')
      .attr('fill', '#666')
      .text(main.label);
  }
};
onMounted(drawChart);
watch(() => props.data, drawChart, { deep: true });
</script>

<style scoped>
.pie-chart {
  display: flex;
  justify-content: center;
  align-items: center;
}
.pie-table {
  margin: 24px 0 0 0;
  border-collapse: collapse;
  font-size: 15px;
  min-width: 350px;
  width: 100%;
}
.pie-table th, .pie-table td {
  border: 1px solid #e0e0e0;
  padding: 6px 10px;
  text-align: left;
}
.pie-table th {
  background: #f8f8f8;
  font-weight: 600;
}
</style> 
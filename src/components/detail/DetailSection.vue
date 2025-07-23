<template>
  <div class="section">
    <div
      v-for="(item, index) in tabData[selectedTab]"
      :key="index"
      class="section-row"
    >
      <div class="section-title">{{ item.title }}</div>
      <div class="section-desc">
        <template v-if="typeof item.desc === 'string'">
          <span v-html="item.desc.replace(/\n/g, '<br>')"></span>
        </template>
        <template v-else-if="Array.isArray(item.desc)">
          <table>
            <thead>
              <tr>
                <th v-for="(value, key) in item.desc[0]" :key="key">{{ key }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in item.desc" :key="idx">
                <td v-for="(value, key) in row" :key="key">{{ value }}</td>
              </tr>
            </tbody>
          </table>
        </template>
        <template v-else-if="typeof item.desc === 'object' && item.desc !== null">
          <!-- 그래프 데이터가 들어오면 그래프 컴포넌트로 렌더링 (예시: MyChartComponent) -->
          <MyChartComponent v-if="item.desc.labels && item.desc.data" :chart-data="item.desc" />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  tabData: Object,
  selectedTab: String
});
// 그래프 컴포넌트 import 예시 (실제 구현 필요)
// import MyChartComponent from '@/components/common/MyChartComponent.vue';
</script>

<style scoped>
.section {
  padding: 32px;
  background: var(--main05);
  width: calc(100% + 40px);
  margin-left: -20px;
  margin-right: -20px;
}
.section-row {
  margin-bottom: 24px;
}
.section-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--black);
  margin-bottom: 8px;
  text-align: left;
}
.section-desc {
  font-size: 16px;
  color: var(--main02);
  text-align: left;
}
.section-desc table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
  font-size: 15px;
}
.section-desc th, .section-desc td {
  border: 1px solid #e0e0e0;
  padding: 6px 10px;
  text-align: left;
}
.section-desc th {
  background: #f8f8f8;
  font-weight: 600;
}
</style> 
<template>
  <div class="section">
    <div
      v-for="(item, index) in Array.isArray(tabData?.[selectedTab]) ? tabData[selectedTab] : []"
      :key="index"
      class="section-row">
      <div class="section-title">{{ item.title }}</div>
      <div class="section-desc">
        <template v-if="item.type === 'holdingsummary' && typeof item.desc === 'object'">
          <DetailHoldingSummary :data="item.desc" />
        </template>
        <template
          v-else-if="item.type === 'holdingsummarydeposit' && typeof item.desc === 'object'">
          <DetailHoldingSummaryDeposit :data="item.desc" />
        </template>
        <template v-else-if="item.type === 'holdinghistory' && Array.isArray(item.desc)">
          <DetailHoldingHistory :data="item.desc" />
        </template>
        <template v-else-if="item.type === 'longtext' && typeof item.desc === 'string'">
          <DetailLongText>
            <span v-html="item.desc.replace(/\n/g, '<br>')"></span>
          </DetailLongText>
        </template>
        <template v-else-if="item.type === 'piechart' && Array.isArray(item.desc)">
          <div style="margin-bottom: 32px">
            <DetailPieChart
              :data="item.desc"
              :label-key="'종목명'"
              :value-key="'비중'" />
          </div>
        </template>
        <template v-else-if="item.type === 'areachart' && Array.isArray(item.desc)">
          <div style="margin-bottom: 32px">
            <DetailAreaChart :data="item.desc" />
          </div>
        </template>
        <template v-else-if="item.type === 'pdf' && Array.isArray(item.desc)">
          <DetailPdfUrl :pdf-list="item.desc" />
        </template>
        <template v-else-if="item.type === 'table' && Array.isArray(item.desc)">
          <DetailTable :desc="item.desc" />
        </template>
        <template v-else-if="item.type === 'news' && Array.isArray(item.desc)">
          <NewsList
            class="news-list-in-detail"
            :news-list="item.desc"
            :keyword="item.keyword || ''"
            :color="item.color || '#007AFF'" />
        </template>
        <template v-else-if="Array.isArray(item.desc)">
          <DetailTable :desc="item.desc" />
        </template>
        <template v-else>
          <span
            v-html="
              item.desc && typeof item.desc === 'string' ? item.desc.replace(/\n/g, '<br>') : ''
            "></span>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import DetailLongText from './section/DetailLongText.vue';
import DetailPieChart from './section/Detail.PieChart.vue';
import DetailPdfUrl from './section/DetailPdfUrl.vue';
import DetailTable from './section/DetailTable.vue';
import DetailAreaChart from './DetailAreaChart.vue';
import DetailHoldingSummary from './section/DetailHoldingSummary.vue';
import DetailHoldingSummaryDeposit from './section/DetailHoldingSummaryDeposit.vue';
import DetailHoldingHistory from './section/DetailHoldingHistory.vue';
import NewsList from '@/components/home/NewsList.vue';

const props = defineProps({
  tabData: Object,
  selectedTab: String
});
// 그래프 컴포넌트 import 예시 (실제 구현 필요)
// import MyChartComponent from '@/components/common/MyChartComponent.vue';
</script>

<style scoped>
.section {
  padding: 32px 32px 80px 32px;
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
.section-desc th,
.section-desc td {
  border: 1px solid var(--main03);
  padding: 6px 10px;
  text-align: left;
}
.section-desc th {
  background: var(--main01);
  font-weight: 600;
  color: var(--white);
}
.section-desc td {
  background: var(--main02);
  color: var(--white);
}
.pdf-url-box {
  background: var(--sub02);
  padding: 8px 10px;
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
}

/* NewsList 컴포넌트 내부의 subItem-title 숨기기 */
.news-list-in-detail :deep(.subItem-title) {
  display: none;
}
</style>

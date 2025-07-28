<template>
  <div
    v-if="Array.isArray(desc) && desc.length"
    class="table-container">
    <table class="detail-table">
      <thead>
        <tr>
          <th
            v-for="(value, key) in desc[0]"
            :key="key">
            {{ key }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, idx) in desc"
          :key="idx">
          <td
            v-for="(value, key) in row"
            :key="key">
            {{ value }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div
    v-else
    class="no-data">
    데이터가 없습니다.
  </div>
</template>

<script setup>
defineProps({
  desc: {
    type: Array,
    required: true
  }
});
</script>

<style scoped>
.table-container {
  margin: 16px 0 0 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 12px;
  padding: 1px;
  background: var(--white);
}

.detail-table {
  border-collapse: collapse;
  font-size: 14px;
  width: 100%;
  min-width: 280px;
  background: var(--white);
}

.detail-table th,
.detail-table td {
  border: 1px solid #e8eaed;
  padding: 12px 16px;
  text-align: left;
  white-space: nowrap;
  vertical-align: middle;
}

.detail-table th {
  background-color: #e8ecff;
  font-weight: 600;
  color: var(--main01);
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.detail-table tbody tr:nth-child(even) {
  background-color: #fafbfc;
}

.detail-table tbody tr:hover {
  background-color: #f0f4ff;
  transition: background-color 0.2s ease;
}

.detail-table tbody tr {
  transition: all 0.2s ease;
}

.no-data {
  text-align: center;
  padding: 24px;
  color: #666;
  font-size: 14px;
  background: #f8f9fa;
  border-radius: 8px;
  margin: 16px 0;
}

/* 모바일 최적화 */
@media (max-width: 768px) {
  .table-container {
    margin: 12px 0 0 0;
    border-radius: 8px;
  }

  .detail-table {
    font-size: 13px;
    min-width: 260px;
  }

  .detail-table th,
  .detail-table td {
    padding: 10px 12px;
  }

  .detail-table th {
    font-size: 12px;
    padding: 8px 12px;
  }

  .no-data {
    padding: 20px;
    font-size: 13px;
    margin: 12px 0;
  }
}

@media (max-width: 480px) {
  .table-container {
    margin: 8px 0 0 0;
    border-radius: 6px;
  }

  .detail-table {
    font-size: 12px;
    min-width: 240px;
  }

  .detail-table th,
  .detail-table td {
    padding: 8px 10px;
  }

  .detail-table th {
    font-size: 11px;
    padding: 6px 10px;
  }

  .no-data {
    padding: 16px;
    font-size: 12px;
    margin: 8px 0;
  }
}

/* 터치 디바이스 최적화 */
@media (hover: none) and (pointer: coarse) {
  .detail-table tbody tr {
    min-height: 44px;
  }

  .detail-table th,
  .detail-table td {
    touch-action: manipulation;
  }
}

/* 긴 텍스트 처리 */
.detail-table td {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 768px) {
  .detail-table td {
    max-width: 150px;
  }
}

@media (max-width: 480px) {
  .detail-table td {
    max-width: 120px;
  }
}
</style>

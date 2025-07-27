<template>
  <table v-if="Array.isArray(desc) && desc.length">
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
  <div v-else>데이터가 없습니다.</div>
</template>

<script setup>
const props = defineProps({
  desc: {
    type: Array,
    required: true
  }
});
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
  font-size: 15px;
  min-width: 350px;
  width: 100%;
}
th,
td {
  border: 1px solid var(--main02); /* 기존보다 더 은은한 테두리 */
  padding: 6px 10px;
  text-align: left;
}

th {
  background-color: #d4dbf9; /* var(--main01) 보다 연한 블루 계열 */
  font-weight: 600;
  color: var(--main01); /* 진한 글씨색으로 가독성 확보 */
}

tbody tr:nth-child(even) {
  background-color: #f9f9f9; /* alternate row: 연한 회색 */
}

tbody tr:hover {
  background-color: #f1f5ff; /* 살짝 블루톤 hover */
}
</style>

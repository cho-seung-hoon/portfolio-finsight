<template>
  <table v-if="Array.isArray(desc) && desc.length">
    <thead>
      <tr>
        <th v-for="(value, key) in desc[0]" :key="key">{{ key }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, idx) in desc" :key="idx">
        <td v-for="(value, key) in row" :key="key">{{ value }}</td>
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
}
th, td {
  border: 1px solid var(--main03);
  padding: 6px 10px;
  text-align: left;
}
th {
  background: var(--main01);
  font-weight: 600;
  color: var(--white);
}
td {
  background: var(--main02);
  color: var(--white);
}
</style> 
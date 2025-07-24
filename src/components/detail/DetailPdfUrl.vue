<template>
  <div class="pdf-url-box">
    <div
      v-for="(group, idx) in pdfList"
      :key="group.category"
      class="pdf-category-row">
      <div class="pdf-category">{{ group.category }}</div>
      <div class="pdf-links">
        <a
          v-for="item in group.items"
          :key="item.label"
          :href="item.url"
          class="pdf-link"
          target="_blank"
          rel="noopener noreferrer">
          <span class="pdf-icon">📄</span>
          {{ item.label }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  pdfList: {
    type: Array,
    required: true
  }
});
</script>

<style scoped>
.pdf-url-box {
  background: #f8e9e6;
  padding: 16px 24px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 15px;
  width: 100%;
}
.pdf-category-row {
  display: flex;
  align-items: flex-start;
  gap: 24px;
}
.pdf-category {
  color: #b9a9a2;
  min-width: 80px;
  font-weight: 600;
  margin-right: 8px;
}
.pdf-links {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
}
.pdf-link {
  color: #222;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: text-decoration 0.2s;
}
.pdf-link:hover {
  text-decoration: underline;
}
.pdf-icon {
  font-size: 15px;
  margin-right: 2px;
}
</style>

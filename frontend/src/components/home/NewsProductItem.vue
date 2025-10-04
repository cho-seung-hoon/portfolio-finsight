<template>
  <div
    class="product-item"
    @click="handleClick">
    <div class="product-title">{{ title }}</div>
    <!--    <div class="product-date">{{ date }}</div>-->
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  url: String,
  date: String
});

const handleClick = () => {
  console.log('상품 클릭:', props.title); // ✅ 안전하게 동작
};
</script>
<style scoped>
.product-item {
  padding: 12px 0;
  background-color: var(--white);
  border-bottom: 1px solid var(--main04);
  cursor: pointer;
}
.product-title {
  font-weight: var(--font-weight-regular);
  margin: 0 0 4px;
  white-space: nowrap; /* 줄바꿈 안함 */
  overflow: hidden; /* 넘치는 내용 숨김 */
  text-overflow: ellipsis; /* 말줄임표 (…) 표시 */
}
</style>

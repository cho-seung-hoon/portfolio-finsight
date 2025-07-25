<template>
  <a class="news-item" :href="url" target="_blank" rel="noopener noreferrer">
    <div class="news-title">{{ title }}</div>
    <div class="news-date">{{ date }}</div>
  </a>
</template>

<script setup>
const props = defineProps({
  title: String,
  url: String,
  date: String,
});


// const handleClick = () => {
//   console.log('뉴스 클릭:', props.title); // ✅ 안전하게 동작
// };

</script>
<style scoped>
.news-item {
  display: block;
  padding:15px 0;
  background-color: var(--white);
  border-bottom: 1px solid var(--main04);
  cursor: pointer;
  text-decoration: none; /* ✅ 링크 스타일 제거 */
  color: inherit;        /* ✅ 글자색 상속 */
}
.news-title {
  font-weight: var(--font-weight-regular);
  margin: 0 0 4px;
  white-space: nowrap;        /* 줄바꿈 안함 */
  overflow: hidden;           /* 넘치는 내용 숨김 */
  text-overflow: ellipsis;    /* 말줄임표 (…) 표시 */
}
.news-date {
  font-size: 0.8rem;
  color: #999;
}
</style>
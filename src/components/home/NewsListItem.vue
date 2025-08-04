<template>
  <a
    class="news-item"
    :href="url"
    target="_blank"
    rel="noopener noreferrer">
    <div class="news-title">{{ title }}</div>

    <div class="news-meta">
      <div class="news-date">{{ formattedDate }}</div>
      <span v-if="sentimentText" :class="['sentiment-tag', sentiment]">
        {{ sentimentText }}
      </span>
    </div>
  </a>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: String,
  url: String,
  sentiment: String,
  date: Array
});


const formattedDate = computed(() => {
  if (!props.date || !Array.isArray(props.date) || props.date.length < 5) {
    return '';
  }

  const [year, month, day, hour, minute] = props.date;

  const fMonth = String(month).padStart(2, '0');
  const fDay = String(day).padStart(2, '0');
  const fHour = String(hour).padStart(2, '0');
  const fMinute = String(minute).padStart(2, '0');

  return `${year}.${fMonth}.${fDay} ${fHour}:${fMinute}`;
});

const sentimentText = computed(() => {
  if (!props.sentiment) return null;
  const sentimentMap = {
    positive: '긍정',
    negative: '부정',
    neutral: '중립'
  };
  return sentimentMap[props.sentiment.toLowerCase()] || null;
});

</script>
<style scoped>
.news-item {
  display: block;
  padding: 15px 0;
  background-color: var(--white);
  border-bottom: 1px solid var(--main04);
  cursor: pointer;
  text-decoration: none; /* ✅ 링크 스타일 제거 */
  color: inherit; /* ✅ 글자색 상속 */
}
.news-title {
  font-weight: var(--font-weight-regular);
  margin: 0 0 13px;
  white-space: nowrap; /* 줄바꿈 안함 */
  overflow: hidden; /* 넘치는 내용 숨김 */
  text-overflow: ellipsis; /* 말줄임표 (…) 표시 */
}
/* --- 추가된 스타일 --- */
.news-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}

.news-date {
  font-size: 0.8rem;
  color: #999;
}

.sentiment-tag {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.5;
}

/* 긍정 태그 스타일 */
.sentiment-tag.positive {
  background-color: #fdd5d9; /* 연한 빨강 */
  color: #b30000; /* 진한 빨강 */
}

/* 부정 태그 스타일 */
.sentiment-tag.negative {
  background-color: #d1f5f3; /* 연한 파랑 */
  color: #007777; /* 진한 파랑 */
}

/* 중립 태그 스타일 */
.sentiment-tag.neutral {
  background-color: #fff3d0; /* 연한 노랑 */
  color: #996600; /* 진한 노랑 */
}
</style>

import { ref, watch, onBeforeUnmount } from 'vue';

export const useInfiniteScroll = (fetchFn, opts = {}) => {
  const pageSize = opts.pageSize;
  const list = ref([]);
  const offset = ref(0);
  const loading = ref(false);
  const sentinelEl = ref(null);
  let observer = null;

  // 다음 데이터를 불러오는 함수
  const next = async () => {
    if (loading.value) return;
    loading.value = true;
    try {
      const rows = await fetchFn({ limit: pageSize, offset: offset.value });
      if (Array.isArray(rows) && rows.length) {
        list.value.push(...rows);
        offset.value += rows.length;
      }
    } finally {
      loading.value = false;
    }
  };

  // 리스트를 초기화하고 첫 페이지부터 다시 불러오는 함수
  const reset = async () => {
    list.value = [];
    offset.value = 0;
    await next();
    observe();
  };

  // IntersectionObserver를 설정하는 함수
  const observe = () => {
    if (observer) {
      observer.disconnect();
    }
    observer = new IntersectionObserver(
      entries => {
        if (entries[0] && entries[0].isIntersecting) next();
      },
      { root: null, rootMargin: '0px', threshold: 0 }
    );
    if (sentinelEl.value) observer.observe(sentinelEl.value);
  };

  // opts.deps가 바뀌면 reset()을 실행
  watch(
    opts.deps,
    () => {
      reset();
    },
    { deep: true }
  );

  onBeforeUnmount(() => {
    if (observer) observer.disconnect();
  });

  return { list, loading, sentinelEl, reset };
};

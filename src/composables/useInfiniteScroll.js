import { ref, watch, onBeforeUnmount } from 'vue';

export const useInfiniteScroll = (fetchFn, opts = {}) => {
  const pageSize = opts.pageSize;
  const list = ref([]);
  const offset = ref(0);
  const loading = ref(false);
  const sentinelEl = ref(null);
  let observer = null;

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

  const reset = async () => {
    list.value = [];
    offset.value = 0;
    await next();
  };

  const observe = () => {
    if (observer) observer.disconnect();
    observer = new IntersectionObserver(
      entries => {
        if (entries[0] && entries[0].isIntersecting) next();
      },
      { root: null, rootMargin: '0px 0px 400px 0px', threshold: 0 }
    );
    if (sentinelEl.value) observer.observe(sentinelEl.value);
  };

  if (Array.isArray(opts.deps) && opts.deps.length) {
    watch(
      opts.deps,
      () => {
        reset();
      },
      { deep: true }
    );
  }

  onBeforeUnmount(() => {
    if (observer) observer.disconnect();
  });

  return { list, loading, sentinelEl, reset, next, observe };
};

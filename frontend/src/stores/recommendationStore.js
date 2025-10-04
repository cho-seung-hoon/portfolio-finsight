import { defineStore } from 'pinia';
import { getRecommendedProducts } from '@/api/recommendation';

export const useRecommendationStore = defineStore('recommendations', {
  state: () => ({
    list: [], // [{ productCode, productCategory, score }]
    loadedAt: 0,
    top: 0
  }),
  getters: {
    scoresByCode: state => {
      const m = new Map();
      for (const { productCode, score } of state.list) m.set(productCode, score);
      return m;
    },
    topCodesByCategory:
      state =>
      (category, n = 1) => {
        const cat = (category || '').toLowerCase();
        return state.list
          .filter(r => (r.productCategory || '').toLowerCase() === cat)
          .sort((a, b) => b.score - a.score)
          .slice(0, n)
          .map(r => r.productCode);
      }
  },
  actions: {
    async ensureLoaded(top = 10, ttlMs = 60_000) {
      if (this.list.length && Date.now() - this.loadedAt < ttlMs && this.top === top) return;
      const data = await getRecommendedProducts(top, ttlMs); // API 유틸에도 캐시 있음
      this.list = Array.isArray(data) ? data : [];
      this.loadedAt = Date.now();
      this.top = top;
    },
    refresh: async function (top = 10) {
      const data = await getRecommendedProducts(top, 0);
      this.list = Array.isArray(data) ? data : [];
      this.loadedAt = Date.now();
      this.top = top;
    },
    invalidate() {
      this.list = [];
      this.loadedAt = 0;
      this.top = 0;
    },
    getScore(code) {
      return this.scoresByCode.get(code) ?? null;
    },
    isRecommended(code) {
      return this.scoresByCode.has(code);
    }
  }
});

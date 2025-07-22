import { defineStore } from 'pinia';

const defaultState = {
  titleParts: [{ text: 'Fin-Sight', color: 'var(--sub01)' }],
  showBackButton: false,
  actions: []
  // {icon:'search', handler: () => console.log('검색')}, {icon:'watch', handler: () => console.log('관심')}
};
export const useHeaderStore = defineStore('header', {
  state: () => ({ ...defaultState }),
  actions: {
    setHeader(options) {
      this.titleParts = options.titleParts || this.titleParts;
      this.showBackButton = options.showBackButton ?? this.showBackButton;
      this.actions = options.actions || this.actions;
    },
    resetHeader() {
      this.$patch(defaultState); // 스토어를 기본 상태로 되돌립니다.
    }
  }
});

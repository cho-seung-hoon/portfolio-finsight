import { defineStore } from 'pinia';

const defaultState = Object.freeze({
  titleParts: [{ text: 'Fin-Sight', color: 'var(--sub01)' }],
  showBackButton: false,
  actions: [],
  showBorder: true,
  stickyHeader: false,
  bColor: 'var(--white)',
  backHandler: null,
});

export const useHeaderStore = defineStore('header', {
  state: () => ({ ...defaultState }),

  actions: {
    setHeader(options) {
      const merged = {
        ...defaultState,
        ...options,
      };

      this.titleParts = merged.titleParts;
      this.showBackButton = merged.showBackButton;
      this.actions = merged.actions;
      this.showBorder = merged.showBorder;
      this.stickyHeader = merged.stickyHeader;
      this.bColor = merged.bColor;
      this.backHandler = merged.backHandler;
    },
    resetHeader() {
      this.$reset();
    },
  },
});
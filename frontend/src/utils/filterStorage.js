const defaultFilters = {
  deposit: { sort: '기본금리순' },
  fund: { fund_type: '전체', country: '전체', sort: '수익률순' },
  etf: { etf_type: '전체', country: '전체', sort: '기준가높은순' },
  isMatched: false
};

export function getFinFilters() {
  const stored = JSON.parse(localStorage.getItem('finFilters') || '{}');
  return {
    deposit: { ...defaultFilters.deposit, ...(stored.deposit || {}) },
    fund: { ...defaultFilters.fund, ...(stored.fund || {}) },
    etf: { ...defaultFilters.etf, ...(stored.etf || {}) },
    isMatched: typeof stored.isMatched === 'boolean' ? stored.isMatched : false
  };
}

export function setFinFilters(filters) {
  localStorage.setItem('finFilters', JSON.stringify(filters));
}

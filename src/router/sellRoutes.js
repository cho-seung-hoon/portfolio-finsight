const sellRoutes = [
  {
    path: '/fund/sell/:id',
    name: 'FundSell',
    component: () => import('@/pages/buysell/fundSell.vue'),
    meta: {
      layout: 'EmptyLayout'
    }
  },
  {
    path: '/etf/sell/:id',
    name: 'ETFSell',
    component: () => import('@/pages/buysell/etfSell.vue'),
    meta: {
      layout: 'EmptyLayout'
    }
  },
  {
    path: '/deposit/sell/:id',
    name: 'DepositSell',
    component: () => import('@/pages/buysell/depositSell.vue'),
    meta: {
      layout: 'EmptyLayout'
    }
  }
];

export default sellRoutes;

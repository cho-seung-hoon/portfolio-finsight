const buyRoutes = [
  {
    path: '/fund/buy/:id',
    name: 'FundBuy',
    component: () => import('@/pages/buysell/fundBuy.vue'),
    meta: {
      layout: 'EmptyLayout'
    }
  },
  {
    path: '/etf/buy/:id',
    name: 'EtfBuy',
    component: () => import('@/pages/buysell/etfBuy.vue'),
    meta: {
      layout: 'EmptyLayout'
    }
  },
  {
    path: '/deposit/buy/:id',
    name: 'DepositBuy',
    component: () => import('@/pages/buysell/depositBuy.vue'),
    meta: {
      layout: 'EmptyLayout'
    }
  }
];

export default buyRoutes;

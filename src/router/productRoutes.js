const productRoutes = [
  {
    path: '/deposit/:id',
    name: 'DepositDetail',
    component: () => import('../pages/DepositPage.vue'),
    meta: {
      layout: 'HeaderLayout',
      header: {
        titleParts: [{ text: '', color: 'transparent' }],
        showBackButton: true,
        showBorder: false,
        bColor: 'var(--main01)'
      }
    }
  },
  {
    path: '/etf/:id',
    name: 'ETFDetail',
    component: () => import('../pages/ETFPage.vue'),
    meta: {
      layout: 'HeaderLayout',
      header: {
        titleParts: [{ text: '', color: 'transparent' }],
        showBackButton: true,
        showBorder: false,
        bColor: 'var(--main01)'
      }
    }
  },
  {
    path: '/fund/:id',
    name: 'FundDetail',
    component: () => import('@/pages/FundPage.vue'),
    meta: {
      layout: 'HeaderLayout',
      header: {
        titleParts: [{ text: '', color: 'transparent' }],
        showBackButton: true,
        showBorder: false,
        bColor: 'var(--main01)'
      }
    }
  }
];

export default productRoutes;

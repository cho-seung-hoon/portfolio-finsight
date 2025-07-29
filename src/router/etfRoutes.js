const etfRoutes = [
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
  }
];

export default etfRoutes;

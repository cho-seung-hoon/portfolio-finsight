const etfRoutes = [
  {
    path: '/etf/:id',
    name: 'ETFDetail',
    component: () => import('../pages/ETFPage.vue'),
    meta: {
      layout: 'HeaderLayout'
    }
  }
];

export default etfRoutes;

const depositRoutes = [
  {
    path: '/deposit/:id',
    name: 'DepositDetail',
    component: () => import('../pages/DepositPage.vue'),
    meta: {
      layout: 'HeaderLayout'
    }
  }
];

export default depositRoutes;

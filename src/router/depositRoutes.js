const depositRoutes = [
  {
    path: '/deposit',
    name: 'deposit',
    component: () => import('../pages/DepositPage.vue'),
    meta: {
      layout: 'HeaderLayout'
    }
  }
];

export default depositRoutes; 
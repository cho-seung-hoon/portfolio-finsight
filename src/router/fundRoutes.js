const fundRoutes = [
  {
    path: '/fund/:id',
    name: 'FundDetail',
    component: () => import('@/pages/FundPage.vue')
  }
];

export default fundRoutes;

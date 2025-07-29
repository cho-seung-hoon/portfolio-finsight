const fundRoutes = [
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

export default fundRoutes;

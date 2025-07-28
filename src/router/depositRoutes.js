const depositRoutes = [
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
  }
];

export default depositRoutes;

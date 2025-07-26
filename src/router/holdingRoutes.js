const holdingRoutes = [
  {
    path: '/holding',
    name: 'holding',
    component: () => import('../pages/HoldingPage.vue'),
    meta: {
      header: {
        titleParts: [{ text: '보유내역', color: 'var(--main01)' }]
      }
    }
  }
];

export default holdingRoutes;

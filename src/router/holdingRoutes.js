const holdingRoutes = [
  {
    path: '/holding',
    name: 'holding',
    component: () => import('../pages/HoldingPage.vue')
    // meta: {
    //     requiresAuth: true,
    // },
  }
];

export default holdingRoutes;

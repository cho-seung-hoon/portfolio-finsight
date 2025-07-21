const myRoutes = [
  {
    path: '/my',
    name: 'my',
    component: () => import('../pages/MyPage.vue')
    // meta: {
    //     requiresAuth: true,
    // },
  }
];

export default myRoutes;

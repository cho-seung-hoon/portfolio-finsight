const listRoutes = [
  {
    path: '/list',
    name: 'list',
    component: () => import('../pages/ListPage.vue')
    // meta: {
    //     requiresAuth: true,
    // },
  }
];

export default listRoutes;

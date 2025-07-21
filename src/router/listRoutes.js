const listRoutes = [
  {
    path: '/list/:category',
    name: 'list-category',
    component: () => import('../pages/ListPage.vue')
    // meta: {
    //     requiresAuth: true,
    // },
  },
  {
    path: '/list',
    redirect: '/list/deposits'
  }
];

export default listRoutes;

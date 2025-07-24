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
    redirect: '/list/deposit'
  },
  {
    path: '/list/search',
    name: 'list-search',
    component: () => import('../pages/list/ListSearchPage.vue'),
    meta: {
      layout: 'HeaderLayout'
    }
  },
  {
    path: '/list/watch',
    name: 'list-watch',
    component: () => import('../pages/list/ListWatchPage.vue'),
    meta: {
      layout: 'HeaderLayout'
    }
  }
];

export default listRoutes;

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
    path: '/list/like',
    name: 'list-like',
    component: () => import('../pages/list/ListLikePage.vue'),
    meta: {
      layout: 'HeaderLayout'
    }
  }
];

export default listRoutes;

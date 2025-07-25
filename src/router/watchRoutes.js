const watchRoutes = [
  {
    path: '/watch',
    name: 'watch',
    component: () => import('../pages/WatchPage.vue'),
    meta: {
      layout: 'HeaderLayout'
    }
  }
];

export default watchRoutes;

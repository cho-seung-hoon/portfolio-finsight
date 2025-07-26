const watchRoutes = [
  {
    path: '/watch',
    name: 'watch',
    component: () => import('../pages/WatchPage.vue'),
    meta: {
      layout: 'HeaderLayout',
      header:{
        titleParts: [{ text: '찜한 목록', color: 'var(--main01)' }],
        showBackButton: true,
      }
    }
  }
];

export default watchRoutes;

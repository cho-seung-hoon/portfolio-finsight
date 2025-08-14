const myRoutes = [
  {
    path: '/my',
    name: 'my',
    component: () => import('../pages/MyPage.vue'),
    meta: {
      header: {
        titleParts: [{ text: '마이페이지', color: 'var(--white)' }],
        bColor: 'var(--main01)',
        showBorder:false
      }
    }
  },
  {
    path: '/user-info-edit',
    name: 'userInfoEdit',
    component: () => import('../pages/UserInfoEdit.vue'),
    meta: {
      layout: 'HeaderLayout',
      header: {
        titleParts: [{ text: '내 정보 수정하기', color: 'var(--white)' }],
        showBackButton: true,
        bColor: 'var(--main01)',
        showBorder:false
      }
    }
  },
  {
    path: '/watch',
    name: 'watch',
    component: () => import('../pages/WatchPage.vue'),
    meta: {
      layout: 'HeaderLayout',
      header: {
        titleParts: [{ text: '찜한 목록', color: 'var(--main01)' }],
        showBackButton: true
      }
    }
  }
];

export default myRoutes;

const myRoutes = [
  {
    path: '/my',
    name: 'my',
    component: () => import('../pages/MyPage.vue'),
    meta: {
      header: {
        titleParts: [{ text: '마이페이지', color: 'var(--white)' }]
      }
    }
  },
  {
    path: '/user-info-edit',
    name: 'userInfoEdit',
    component: () => import('../pages/UserInfoEdit.vue'),
    meta: {
      header: {
        titleParts: [{ text: '내 정보 수정하기', color: 'var(--main01)' }]
      }
    }
  }
];

export default myRoutes;

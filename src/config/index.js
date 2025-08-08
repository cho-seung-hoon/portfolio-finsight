import IconHome from '@/components/icons/IconHome.vue';
import IconHolding from '@/components/icons/IconHolding.vue';
import IconList from '@/components/icons/IconList.vue';
import IconMy from '@/components/icons/IconMy.vue';

export default {
  appName: 'Fin-sight',
  menus: [
    {
      name: 'Home',
      path: '/',
      icon: IconHome
    },
    {
      name: '보유내역',
      path: '/holding',
      icon: IconHolding
    },
    {
      name: '상품탐색',
      path: '/list',
      icon: IconList
    },
    {
      name: 'MY',
      path: '/my',
      icon: IconMy
    }
  ]
};

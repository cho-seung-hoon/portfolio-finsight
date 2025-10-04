import './assets/styles/main.css';
import './assets/styles/global.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' // 1. 임포트


import { createApp } from 'vue';
import { createPinia } from 'pinia';
import VueApexCharts from 'vue3-apexcharts';

import App from './App.vue';
import router from './router';

const app = createApp(App);
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.component('Apexchart', VueApexCharts);

router.isReady().then(() => {
  app.mount('#app');
});

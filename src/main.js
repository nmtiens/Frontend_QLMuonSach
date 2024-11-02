import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Đường dẫn đến file router

createApp(App)
  .use(router) // Sử dụng router
  .mount('#app');

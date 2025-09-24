import './style.css';
import 'vue-toastification/dist/index.css';

import { createApp } from 'vue';
import Toast from 'vue-toastification';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(router);
app.use(Toast, {
  transition: 'Vue-Toastification__fade',
  transitionDuration: 500,
  position: 'top-right',
  timeout: 2000,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  hideProgressBar: true,
  icon: true,
});

app.mount('#app');

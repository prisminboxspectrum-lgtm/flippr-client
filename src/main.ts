import { createApp } from 'vue';
import App from './App.vue';
import './style.css';

import router from './router';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

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

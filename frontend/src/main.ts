import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/bootstrap/css/bootstrap.min.css';
import './assets/bootstrap/js/bootstrap.min.js';
import './assets/js/bold-and-dark.js';

createApp(App).use(router).mount('#app');

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/bootstrap/css/bootstrap.min.css'
import './assets/bootstrap/js/bootstrap.min.js'
import './assets/js/bold-and-dark.js'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { createPinia } from 'pinia'
const app = createApp(App)
const pinia = createPinia()
app.use(router)
app.use(pinia)
app.mount('#app')
useRegisterSW()

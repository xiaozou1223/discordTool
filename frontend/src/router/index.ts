import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/UserLogin.vue'
import Signup from '../components/UserSignup.vue'
import User from '@/components/UserProfile.vue'
import Guild from '../components/GuildsView.vue'
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
  },
  {
    path: '/',
    name: 'Home',
    component: Login,
  },
  {
    path: '/user',
    name: 'User',
    component: User,
  },
  {
    path: '/discordServer',
    name: 'DiscordServer',
    component: Guild,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

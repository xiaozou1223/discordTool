import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/UserLogin.vue'
import Signup from '../components/UserSignup.vue'
import User from '@/components/UserProfile.vue'
import Guild from '../components/GuildsView.vue'
import { useUserStore } from '../stores/useUserStore'
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
    meta: { requiresAuth: true },
  },
  {
    path: '/discordServer',
    name: 'DiscordServer',
    component: Guild,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const routesNeedDiscordToken = ['DiscordServer']
const routesNeedDiscordUid = ['']
const publicRoutes = ['Login', 'Signup']

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const routerName = to.name!.toString()

  if (!userStore.jwt && !publicRoutes.includes(routerName)) {
    alert('請先登入!')
    next({ name: 'Login' })
  } else if (userStore.jwt && userStore.user.isTokenValid && publicRoutes.includes(routerName)) {
    next({ name: 'DiscordServer' })
  } else if (userStore.jwt && !userStore.user.isTokenValid && publicRoutes.includes(routerName)) {
    next({ name: 'User' })
  } else if (userStore.jwt && !userStore.user.isTokenValid && routesNeedDiscordToken.includes(routerName)) {
    alert('DiscordToken無效')
    next({ name: 'User' })
  } else {
    next()
  }
})

export default router

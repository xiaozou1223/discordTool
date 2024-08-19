<template>
  <nav v-if="!userStore.jwt" class="navbar navbar-expand-md sticky-top py-3 navbar-dark" id="mainNav">
    <div class="container">
      <a class="navbar-brand d-flex align-items-center" href="/"><span>DiscordTool</span></a>
    </div>
  </nav>
  <nav v-else class="navbar navbar-expand-md sticky-top py-3 navbar-dark" id="mainNav">
    <div class="container">
      <a class="navbar-brand d-flex align-items-center">
        <img class="rounded-circle" width="65" height="65" :src="userStore.iconUrl" />
        <span style="padding: 0px; margin-left: 10px">{{
          userStore.user.discordUserData?.global_name ? userStore.user.discordUserData?.global_name : 'UNKNOW'
        }}</span>
      </a>
      <span v-if="userStore.user.isTokenValid" class="navbar-text" style="font-size: 15px; color: rgb(0, 255, 71); font-weight: bold">Token有效</span>
      <span v-else class="navbar-text" style="font-size: 15px; color: rgb(255, 0, 0); font-weight: bold">Token無效</span>
      <button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navcol">
        <span class="visually-hidden">Toggle navigation</span>
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse text-center" id="navcol">
        <ul class="navbar-nav mx-auto"></ul>
        <div class="container">
          <div class="row">
            <div class="col-md-3">
              <a
                v-if="userStore.user.isTokenValid"
                class="nav-link page-link clickable-item"
                role="button"
                :style="{ color: page === Page.DiscordServer ? '#00bfff' : 'white' }"
                :data-bs-toggle="isPhoneWidth ? 'collapse' : null"
                :data-bs-target="isPhoneWidth ? '#navcol' : null"
                @click="switchRouter('DiscordServer')"
                >群組</a
              >
            </div>
            <div class="col-md-3">
              <a
                v-if="userStore.user.isTokenValid"
                class="nav-link page-link clickable-item"
                role="button"
                :style="{ color: page === Page.Listening ? '#00bfff' : 'white' }"
                :data-bs-toggle="isPhoneWidth ? 'collapse' : null"
                :data-bs-target="isPhoneWidth ? '#navcol' : null"
                @click="switchRouter('User')"
                >監聽</a
              >
            </div>
            <div class="col-md-3">
              <a
                role="button"
                class="nav-link page-link clickable-item"
                :style="{ color: page === Page.User ? '#00bfff' : 'white' }"
                :data-bs-toggle="isPhoneWidth ? 'collapse' : null"
                :data-bs-target="isPhoneWidth ? '#navcol' : null"
                @click="switchRouter('User')"
                >帳號</a
              >
            </div>
            <div class="col-md-3">
              <a role="button" class="nav-link logout-link clickable-item" @click="logout">登出</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
<script setup lang="ts">
import router from '@/router'
import Cookies from 'js-cookie'
import { onMounted, onUnmounted, ref, type Ref } from 'vue'
import { useUserStore } from '../stores/useUserStore'
enum Page {
  DiscordServer = 'DiscordServer',
  User = 'User',
  Listening = 'Listening',
}

const userStore = useUserStore()
const isPhoneWidth = ref(window.innerWidth < 768)
const page: Ref<Page> = ref(Page.DiscordServer)

function handleResize() {
  isPhoneWidth.value = window.innerWidth < 768
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  userStore.reloadJwt()
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

function logout() {
  const ok = confirm('確定要登出嗎?')
  if (!ok) {
    return
  }
  console.log('Logout!')
  Cookies.remove('jwt')
  userStore.reloadJwt()
  router.push('Login')
}

function switchRouter(routerName: string) {
  router.push({ name: routerName })
  page.value = routerName as Page
}
</script>

<style scoped>
.page-link {
  font-size: 22px;
  color: white;
  font-weight: bold;
}
.logout-link {
  font-size: 22px;
  color: red;
  font-weight: bold;
}
</style>

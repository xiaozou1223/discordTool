<template>
  <nav class="navbar navbar-expand-md sticky-top py-3 navbar-dark" id="mainNav">
    <div class="container">
      <a class="navbar-brand d-flex align-items-center">
        <img class="rounded-circle" width="65" height="65" :src="iconUrl" />
        <span style="padding: 0px; margin-left: 10px" v-if="user.discordUserData?.global_name">{{ user.discordUserData?.global_name }}</span>
        <span style="padding: 0px; margin-left: 10px" v-else>UNKNOW</span>
      </a>
      <span v-if="user.isTokenValid" class="navbar-text" style="font-size: 15px; color: rgb(0, 255, 71); font-weight: bold">Token有效</span>
      <span v-else class="navbar-text" style="font-size: 15px; color: rgb(255, 0, 0); font-weight: bold">Token無效</span>
      <button data-bs-toggle="collapse" class="navbar-toggler" data-bs-target="#navcol-1">
        <span class="visually-hidden">Toggle navigation</span>
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse text-center" id="navcol-1">
        <ul class="navbar-nav mx-auto"></ul>
        <div class="container">
          <div class="row navbar-links">
            <div class="col-md-3">
              <a
                v-if="user.isTokenValid"
                role="button"
                style="font-size: 22px; color: rgb(255, 255, 255); font-weight: bold"
                @click="router.push({ name: 'DiscordServer' })"
                >伺服器</a
              >
            </div>
            <div class="col-md-3">
              <a
                v-if="user.isTokenValid"
                role="button"
                style="font-size: 22px; color: rgb(255, 255, 255); font-weight: bold"
                @click="router.push({ name: 'User' })"
                >已監聽頻道</a
              >
            </div>
            <div class="col-md-3">
              <a role="button" style="font-size: 22px; color: rgb(255, 255, 255); font-weight: bold" @click="router.push({ name: 'User' })"
                >帳號設定</a
              >
            </div>
            <div class="col-md-3"><a role="button" style="font-size: 22px; color: rgb(255, 0, 0); font-weight: bold" @click="logout">登出</a></div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
<script setup lang="ts">
import router from '@/router'
import Cookies from 'js-cookie'
import * as jwtDecode from 'jwt-decode'
import { ref, type Ref } from 'vue'
import { UserStore } from './User'

const { user, setUser } = UserStore()
const iconUrl: Ref<string> = ref('')

const token = Cookies.get('jwt')
if (!token) {
  router.push({ name: 'Login' })
} else {
  setUser(jwtDecode.jwtDecode(token))
  if (user.value.discordUserData) {
    iconUrl.value = `https://cdn.discordapp.com/avatars/${user.value.discordUserData.id}/${user.value.discordUserData.avatar}.png`
  } else {
    iconUrl.value = `https://i.imgur.com/Yow9X0v.jpeg`
  }
}

function logout() {
  Cookies.remove('jwt')
  location.reload()
}
</script>

<style>
span {
  user-select: none; /* For modern browsers */
  -webkit-user-select: none; /* For Safari */
  -moz-user-select: none; /* For Firefox */
  -ms-user-select: none; /* For Internet Explorer/Edge */
}

.navbar-links a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.navbar-links a:active {
  background-color: rgba(255, 255, 255, 0.2);
}
@media (max-width: 991.98px) {
  .navbar-links a {
    display: block;
    margin-top: 10px;
  }
}
</style>

import { defineStore } from 'pinia'
import { ReadUserResponseDto } from '@/api/user/dto/read-user.dto'
import router from '@/router'
import Cookies from 'js-cookie'
import * as jwtDecode from 'jwt-decode'
import { ref, watch } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref(new ReadUserResponseDto())
  const jwt = ref<string | null | undefined>(null)
  const iconUrl = ref('https://i.imgur.com/Yow9X0v.jpeg')

  const checkLoginStatus = () => {
    const currentRouter = window.location.pathname
    if (jwt.value) {
      reloadUser()
      if (currentRouter === '/login' || currentRouter === '/' || currentRouter === '/signup') {
        router.push({ name: 'DiscordServer' })
      }
    } else {
      if (currentRouter !== '/login') {
        router.push({ name: 'Login' })
      }
    }
  }

  const reloadUser = () => {
    console.log('reloadUser!')
    if (jwt.value) {
      user.value = jwtDecode.jwtDecode(jwt.value)
      if (user.value.discordUserData && user.value.discordUserData.avatar) {
        iconUrl.value = `https://cdn.discordapp.com/avatars/${user.value.discordUserData.id}/${user.value.discordUserData.avatar}.png`
      } else {
        iconUrl.value = 'https://i.imgur.com/Yow9X0v.jpeg'
      }
    } else {
      user.value = new ReadUserResponseDto()
    }
  }

  const reloadJwt = () => {
    console.log('reloadJwt!')
    jwt.value = Cookies.get('jwt')
    reloadUser()
  }

  watch(jwt, () => {
    console.log('jwt發生變化!')
    checkLoginStatus()
  })
  watch(user, () => {
    console.log('user發生變化!')
  })

  return {
    iconUrl,
    user,
    jwt,
    reloadJwt,
  }
})
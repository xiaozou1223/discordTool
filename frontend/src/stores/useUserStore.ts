import { defineStore } from 'pinia'
import { ReadUserResponseDto } from '@/api/user/dto/read-user.dto'
import router from '@/router'
import Cookies from 'js-cookie'
import * as jwtDecode from 'jwt-decode'
import { ref, watch } from 'vue'
import { generateUserAvatarUrl } from '@/functions/Discord'

export const useUserStore = defineStore('user', () => {
  const user = ref(new ReadUserResponseDto())
  const jwt = ref<string | null | undefined>(null)
  const iconUrl = ref('/unknow.jpg')

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
      iconUrl.value = generateUserAvatarUrl(user.value.discordUserData)
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

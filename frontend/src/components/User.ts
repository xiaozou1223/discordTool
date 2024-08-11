import { ReadUserResponseDto } from '@/api/user/dto/read-user.dto'
import router from '@/router'
import Cookies from 'js-cookie'
import * as jwtDecode from 'jwt-decode'
import { onMounted, ref, watch, type Ref } from 'vue'

const user = ref(new ReadUserResponseDto())
const jwt: Ref<string | undefined> = ref(undefined)
const iconUrl: Ref<string> = ref('https://i.imgur.com/Yow9X0v.jpeg')

watch(jwt, () => {
  checkLoginStatus()
})

export function checkLoginStatus() {
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
  }
}

const reloadJwt = () => {
  console.log('reloadJwt!')
  jwt.value = Cookies.get('jwt')
}

export function UserStore() {
  return {
    iconUrl,
    user,
    reloadUser,
  }
}

export function JwtStore() {
  return {
    jwt,
    reloadJwt,
  }
}

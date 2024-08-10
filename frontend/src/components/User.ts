import { ReadUserResponseDto } from '@/api/user/dto/read-user.dto'
import Cookies from 'js-cookie'
import * as jwtDecode from 'jwt-decode'
import { ref, type Ref } from 'vue'

const user = ref(new ReadUserResponseDto())
const jwt: Ref<string | undefined> = ref(undefined)
const iconUrl: Ref<string> = ref('https://i.imgur.com/Yow9X0v.jpeg')

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

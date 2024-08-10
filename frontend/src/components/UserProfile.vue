<template>
  <section class="py-5">
    <div class="container py-5" style="text-align: center; background: #322e2e">
      <div class="text-center">
        <div>
          <span style="font-size: 28px">帳號</span><span style="font-size: 28px; margin-left: 20px">{{ user.account }}</span>
        </div>
        <div><span style="font-size: 28px">修改密碼</span><input v-model="updateData.password" type="password" style="margin-left: 20px" /></div>
        <div><span style="font-size: 28px">確認密碼</span><input v-model="confirmPassword" type="password" style="margin-left: 20px" /></div>
        <div>
          <span style="font-size: 28px">DiscordToken</span>
          <input v-model="updateData.discordToken" type="text" style="margin-left: 20px" />
        </div>
        <div style="margin-top: 30px"><button class="btn btn-primary" type="button" @click="update(user.account)">保存</button></div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { updateUseApi } from '@/api/user/user'
import { ReadUserResponseDto } from '@/api/user/dto/read-user.dto'
import Cookies from 'js-cookie'
import * as jwtDecode from 'jwt-decode'
import { ref, type Ref } from 'vue'
import type { ApiResponse } from '@/common.class'
import { UpdateUserDto } from '@/api/user/dto/update-user.dto'

const token = Cookies.get('jwt')
const user: Ref<ReadUserResponseDto> = ref(new ReadUserResponseDto())
const updateData: Ref<UpdateUserDto> = ref(new UpdateUserDto())
const confirmPassword = ref('')

if (token) {
  user.value = jwtDecode.jwtDecode(token)
}

async function update(account: string) {
  if (updateData.value.password && confirmPassword.value !== updateData.value.password) {
    return alert('二次密碼不相同')
  }
  await updateUseApi(account, updateData.value)
    .then((res: any) => {
      const result: ApiResponse<ReadUserResponseDto> = res
      alert(result.message)
      user.value = result.data as ReadUserResponseDto
      location.reload()
    })
    .catch((res: any) => {
      const result: ApiResponse<ReadUserResponseDto> = res
      alert(result.message)
    })
}
</script>

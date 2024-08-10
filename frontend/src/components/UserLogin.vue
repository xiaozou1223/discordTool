<template>
  <section class="py-5">
    <div class="container py-5">
      <div class="row d-flex justify-content-center">
        <div class="col-md-6 col-xl-4">
          <div class="card">
            <div class="card-body text-center d-flex flex-column align-items-center">
              <div class="bs-icon-xl bs-icon-circle bs-icon-primary shadow bs-icon my-4"></div>
              <div class="mb-3">
                <input class="form-control" type="account" name="account" @input="validateAccount" v-model="account" placeholder="帳號" />
              </div>
              <div class="mb-3"><input class="form-control" type="password" name="password" v-model="password" placeholder="密碼" /></div>
              <div class="mb-3"><button class="btn btn-primary shadow d-block w-100" @click="login">登入</button></div>
              <RouterLink to="signup">註冊</RouterLink>
              <p class="text-muted">忘記密碼</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { loginAPI } from '../api/user/user'
import type { ReadUserResponseDto } from '@/api/user/dto/read-user.dto'
import type { ApiResponse } from '@/common.class'
import router from '@/router'
import { JwtStore, UserStore } from './User'
const { reloadJwt, jwt } = JwtStore()
const { reloadUser } = UserStore()

const account = ref('')
const password = ref('')

watch(jwt, () => {
  if (jwt) {
    router.push({ name: 'DiscordServer' })
  }
})

async function login() {
  if (!account.value || !password.value) {
    return alert('欄位不可為空')
  }
  if (containsNonAlphanumeric(account.value)) {
    return alert('帳號只能使用英文')
  }
  await loginAPI(account.value, password.value)
    .then(() => {
      router.push({ name: 'DiscordServer' })
      reloadJwt()
      reloadUser()
    })
    .catch((res: any) => {
      const result: ApiResponse<ReadUserResponseDto> = res
      alert(result.message)
    })
}
function validateAccount() {
  account.value = account.value.replace(/[^a-zA-Z0-9]/g, '')
}
function containsNonAlphanumeric(str: string): boolean {
  return /[^a-zA-Z0-9]/.test(str)
}
</script>

<template>
  <section class="py-5">
    <div class="container py-5">
      <div class="row d-flex justify-content-center">
        <div class="col-md-6 col-xl-4">
          <div class="card">
            <div class="card-body text-center d-flex flex-column align-items-center">
              <div class="bs-icon-xl bs-icon-circle bs-icon-primary shadow bs-icon my-4">
              </div>
              <div class="mb-3">
                <input class="form-control" type="account" name="account" @input="validateAccount" v-model="account" placeholder="帳號" />
              </div>
              <div class="mb-3"><input class="form-control" type="password" name="password" v-model="password" placeholder="密碼" /></div>
              <div class="mb-3">
                <input
                  class="form-control"
                  type="password"
                  name="confirm-password"
                  v-model="confirmPassword"
                  placeholder="確認密碼"
                  style="margin-top: 14px"
                />
              </div>
              <div class="mb-3"><button class="btn btn-primary shadow d-block w-100" @click="signup">註冊</button></div>
              <p class="text-muted">有帳號了?&nbsp;<RouterLink to="/login">登入</RouterLink></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { registerApi } from '../api/user/user'
import type { ReadUserResponseDto } from '@/api/user/dto/read-user.dto'
import type { ApiResponse } from '@/common.class'
import router from '@/router'
const account = ref('')
const password = ref('')
const confirmPassword = ref('')
async function signup() {
  if (!account.value || !password.value || !confirmPassword.value) {
    return alert('欄位不可為空')
  }
  if (containsNonAlphanumeric(account.value)) {
    return alert('帳號只能使用英文')
  }
  if (password.value !== confirmPassword.value) {
    return alert('兩次密碼不相同')
  }
  await registerApi({ account: account.value, password: password.value })
    .then((res: any) => {
      const result: ApiResponse<ReadUserResponseDto> = res
      alert(result.message)
      router.push({ name: 'Login' })
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

<template>

        <Nav/>
        <section class="py-5">
            <div class="container py-5">
                <div class="row d-flex justify-content-center">
                    <div class="col-md-6 col-xl-4">
                        <div class="card">
                            <div class="card-body text-center d-flex flex-column align-items-center">
                                <div class="bs-icon-xl bs-icon-circle bs-icon-primary shadow bs-icon my-4"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-person">
                                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664z"></path>
                                    </svg></div>
                                    <div class="mb-3"><input class="form-control" type="account" name="account"  @input="validateAccount" v-model="account" placeholder="帳號"></div>
                                    <div class="mb-3"><input class="form-control"  name="password" v-model="password" placeholder="密碼"></div>
                                    <div class="mb-3"><button class="btn btn-primary shadow d-block w-100" @click="login" >登入</button></div>
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
import { ref } from 'vue';
import Nav from './LoginSingup/Nav.vue'
import { loginAPI } from '../api/user/user';
import type { ReadUserResponseDto } from '@/api/user/dto/read-user.dto';
import type { ApiResponse } from '@/common.class';
import router from '@/router';


const account = ref('');
const password = ref('');

async function login(){
    if(!account.value||!password.value){
        return alert('欄位不可為空');
    }
    if(containsNonAlphanumeric(account.value)){
       return alert('帳號只能使用英文');
    }
    await loginAPI(account.value,password.value)
    .then((res:any)=>{
        const result:ApiResponse<ReadUserResponseDto> = res;
        router.push({ name: 'User' });
    })
    .catch((res:any)=>{
        const result:ApiResponse<ReadUserResponseDto> = res;
        alert(result.message);
    })

}
function validateAccount(){
  account.value = account.value.replace(/[^a-zA-Z0-9]/g, '');
}
function containsNonAlphanumeric(str: string): boolean {
  return /[^a-zA-Z0-9]/.test(str);
}
</script>
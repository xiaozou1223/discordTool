import apiClient from '../index'
import { CreateUserDto } from './dto/create-user.dto'
import type { AxiosResponse } from 'axios'
import type { UpdateUserDto } from './dto/update-user.dto'

export async function loginAPI(account: string, password: string) {
  const response: AxiosResponse = await apiClient.post('/auth/login', { account, password })
  return response.data
}

export async function registerApi(userdata: CreateUserDto) {
  const response: AxiosResponse = await apiClient.post('/user', userdata)
  return response.data
}

export async function updateUseApi(userdata: UpdateUserDto) {
  const response: AxiosResponse = await apiClient.patch(`/user`, userdata)
  return response.data
}

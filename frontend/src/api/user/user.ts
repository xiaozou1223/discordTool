import apiClient from '../index'
import { ApiResponse } from '../../common.class'
import { CreateUserDto } from './dto/create-user.dto'
import type { ReadUserResponseDto } from './dto/read-user.dto'
import type { AxiosError, AxiosResponse } from 'axios'
import axios from 'axios'
import type { UpdateUserDto } from './dto/update-user.dto'
import type { APIUser } from 'discord-api-types/v10'

export async function loginAPI(account: string, password: string) {
  try {
    const response: AxiosResponse = await apiClient.post('/auth/login', { account, password })
    return response.data
  } catch (err: any) {
    throw (err.response as AxiosResponse).data
  }
}

export async function registerApi(userdata: CreateUserDto) {
  try {
    const response: AxiosResponse = await apiClient.post('/user', userdata)
    return response.data
  } catch (err: any) {
    throw (err.response as AxiosResponse).data
  }
}

export async function updateUseApi(userdata: UpdateUserDto) {
  try {
    const response: AxiosResponse = await apiClient.patch(`/user`, userdata)
    return response.data
  } catch (err: any) {
    throw (err.response as AxiosResponse).data
  }
}

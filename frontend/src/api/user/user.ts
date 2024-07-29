import apiClient from '../index';
import { ApiResponse } from '../../common.class';
import { CreateUserDto } from './dto/create-user.dto';
import type { ReadGuildsResponseDto, ReadUserResponseDto } from './dto/read-user.dto';
import type { AxiosError, AxiosResponse } from 'axios';
import axios from 'axios';
import type { UpdateUserDto } from './dto/update-user.dto';

export async function loginAPI(account: string, password: string) {
  try {
    const response: AxiosResponse = await apiClient.post('/auth/login', { account, password });
    return response.data;
  } catch (err: any) {
    throw (err.response as AxiosResponse).data;
  }
}

export async function registerApi(userdata: CreateUserDto) {
  try {
    const response: AxiosResponse = await apiClient.post('/user', userdata);
    return response.data;
  } catch (err: any) {
    throw (err.response as AxiosResponse).data;
  }
}

export async function updateUseApi(account: string, userdata: UpdateUserDto) {
  try {
    const response: AxiosResponse = await apiClient.patch(`/user/${account}`, userdata);
    return response.data;
  } catch (err: any) {
    throw (err.response as AxiosResponse).data;
  }
}

export async function getGuildsApi(account: string): Promise<ApiResponse<ReadGuildsResponseDto>> {
  try {
    const response: AxiosResponse = await apiClient.get(`/user/${account}/guilds`);
    return response.data;
  } catch (err: any) {
    throw (err.response as AxiosResponse).data;
  }
}

import apiClient from '../index';
import { ApiResponse } from '../../common.class';
import type { AxiosError, AxiosResponse } from 'axios';

export async function getChannelsApi(guildId: string) {
  try {
    const response: AxiosResponse = await apiClient.get(`/guild/${guildId}/channels`);
    return response.data;
  } catch (err: any) {
    throw (err.response as AxiosResponse).data;
  }
}

export async function getMemberByUserIdAndGuildIdApi(guildId: string, userId: string) {
  try {
    const response: AxiosResponse = await apiClient.get(`/guild/${guildId}/members/${userId}`);
    return response.data;
  } catch (err: any) {
    throw (err.response as AxiosResponse).data;
  }
}

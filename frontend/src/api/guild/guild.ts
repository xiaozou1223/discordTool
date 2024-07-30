import apiClient from '../index';
import { ApiResponse } from '../../common.class';
import type { AxiosResponse } from 'axios'
import type { APIGuildMember } from 'discord-api-types/v10';

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

export async function getRoleByGuildIdApi(guildId: string) {
  try {
    const response: AxiosResponse = await apiClient.get(`/guild/${guildId}/roles`);
    return response.data;
  } catch (err: any) {
    throw (err.response as AxiosResponse).data;
  }
}

export async function getGuildMemberApi(guildId: string, discordUserId: string): Promise<ApiResponse<APIGuildMember>> {
  try {
    const response: AxiosResponse = await apiClient.get(`/guild/${guildId}/members/${discordUserId}`);
    return response.data;
  } catch (err: any) {
    throw (err.response as AxiosResponse).data;
  }
}
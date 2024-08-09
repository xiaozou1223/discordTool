import apiClient from '../index'
import { ApiResponse } from '../../common.class'
import type { AxiosResponse } from 'axios'
import type { APIGuild, APIGuildMember, APIRole } from 'discord-api-types/v10'
import type { DiscordChannel } from './dto/read-channel'

export async function getChannelsApi(guildId: string): Promise<ApiResponse<DiscordChannel>> {
  try {
    const response: AxiosResponse = await apiClient.get(`/guild/${guildId}/channels`)
    return response.data
  } catch (err: any) {
    throw (err.response as AxiosResponse).data
  }
}

export async function getMemberByUserIdAndGuildIdApi(guildId: string, userId: string): Promise<ApiResponse<APIGuildMember>> {
  try {
    const response: AxiosResponse = await apiClient.get(`/guild/${guildId}/members/${userId}`)
    return response.data
  } catch (err: any) {
    throw (err.response as AxiosResponse).data
  }
}

export async function getRoleByGuildIdApi(guildId: string): Promise<ApiResponse<APIRole>> {
  try {
    const response: AxiosResponse = await apiClient.get(`/guild/${guildId}/roles`)
    return response.data
  } catch (err: any) {
    throw (err.response as AxiosResponse).data
  }
}

export async function getGuildApi(guildId: string): Promise<ApiResponse<APIGuild>> {
  try {
    const response: AxiosResponse = await apiClient.get(`/guild/${guildId}`)
    return response.data
  } catch (err: any) {
    throw (err.response as AxiosResponse).data
  }
}

export async function getGuildMemberApi(guildId: string, discordUserId: string): Promise<ApiResponse<APIGuildMember>> {
  try {
    const response: AxiosResponse = await apiClient.get(`/guild/${guildId}/members/${discordUserId}`)
    return response.data
  } catch (err: any) {
    throw (err.response as AxiosResponse).data
  }
}

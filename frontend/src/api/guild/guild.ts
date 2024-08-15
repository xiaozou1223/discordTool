import apiClient from '../index'
import { ApiResponse, type APISearchMessage } from '../../common.class'
import type { AxiosResponse } from 'axios'
import type { APIGuild, APIGuildMember, APIRole } from 'discord-api-types/v10'
import type { DiscordChannel } from './dto/read-channel'
import type { ReadGuildsResponseDto } from './dto/read-guilds'

export async function getChannelsApi(guildId: string): Promise<ApiResponse<DiscordChannel[]>> {
  const response: AxiosResponse = await apiClient.get(`/guild/${guildId}/channels`)
  return response.data
}

export async function getMemberByUserIdAndGuildIdApi(guildId: string, userId: string): Promise<ApiResponse<APIGuildMember>> {
  const response: AxiosResponse = await apiClient.get(`/guild/${guildId}/members/${userId}`)
  return response.data
}

export async function getRoleByGuildIdApi(guildId: string): Promise<ApiResponse<APIRole>> {
  const response: AxiosResponse = await apiClient.get(`/guild/${guildId}/roles`)
  return response.data
}

export async function getGuildApi(guildId: string): Promise<ApiResponse<APIGuild>> {
  const response: AxiosResponse = await apiClient.get(`/guild/${guildId}`)
  return response.data
}

export async function getGuildMemberApi(guildId: string, discordUserId: string): Promise<ApiResponse<APIGuildMember>> {
  const response: AxiosResponse = await apiClient.get(`/guild/${guildId}/members/${discordUserId}`)
  return response.data
}

export async function getGuildsApi(): Promise<ApiResponse<ReadGuildsResponseDto[]>> {
  const response: AxiosResponse = await apiClient.get(`/guild`)
  return response.data
}

export async function searchMessagesApi(guildId: string, searchQuery: string): Promise<ApiResponse<APISearchMessage>> {
  const response: AxiosResponse = await apiClient.get(`/guild/${guildId}/messages/search?${searchQuery}`)
  return response.data
}

export async function deleteMessagesApi(channelId: string, messageId: string): Promise<ApiResponse<null>> {
  const response: AxiosResponse = await apiClient.delete(`/guild/${channelId}/${messageId}`)
  return response.data
}

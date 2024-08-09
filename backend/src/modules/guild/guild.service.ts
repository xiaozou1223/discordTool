import { Injectable } from '@nestjs/common';
import { APIGuild, APIGuildChannel, APIGuildMember, APIMessage, APIRole, APIUser } from 'discord-api-types/v10';
import { DiscordApi } from 'src/discord.api';
import { DiscordChannel } from './dto/read-channel';
import { ApiResponse } from 'src/common.class';

@Injectable()
export class GuildService {
  async getChannels(token: string, guildId: string) {
    const result = await DiscordApi.getChannels(token, guildId);
    const respone: ApiResponse<DiscordChannel> = new ApiResponse();
    const orginData = result.data as APIGuildChannel<any>[];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, ...resultMessage } = result;
    respone.data = orginData.map((channel) => {
      return {
        id: channel.id,
        name: channel.name,
        type: channel.type,
        parent_id: channel.parent_id,
        permission_overwrites: channel.permission_overwrites,
        position: channel.position,
      };
    });
    respone.set(resultMessage);
    return respone;
  }

  async getRolesByGuildId(token: string, guildId: string) {
    const result = await DiscordApi.getRolesByGuildId(token, guildId);
    const { data, ...resultMessage } = result;
    const respone: ApiResponse<APIRole> = new ApiResponse();
    respone.data = data;
    respone.set(resultMessage);
    return respone;
  }

  async getMemberByUserIdAndGuildId(token: string, guildId: string, userId: string) {
    const result = await DiscordApi.getMemberByUserIdAndGuildId(token, guildId, userId);
    const { data, ...resultMessage } = result;
    const respone: ApiResponse<APIGuildMember> = new ApiResponse();
    respone.data = data;
    respone.set(resultMessage);
    return respone;
  }

  async getMember(token: string, guildId: string, discordUserId: string) {
    const response = new ApiResponse<APIGuildMember>();
    const discordResult = await DiscordApi.getMember(token, guildId, discordUserId);
    response.set(discordResult);
    return response;
  }

  async searchMessage(token: string, guildId: string, queryString: string) {
    const response = new ApiResponse<APIMessage>();
    const discordResult = await DiscordApi.searchMessage(token, guildId, queryString);
    response.set(discordResult);
    return response;
  }

  async deleteMessage(token: string, channelId: string, messageId: string) {
    const response = new ApiResponse<null>();
    const discordResult = await DiscordApi.deleteMessage(token, channelId, messageId);
    response.set(discordResult);
    return response;
  }

  async getGuildInfo(token: string, guildId: string) {
    const response = new ApiResponse<APIGuild>();
    const discordResult = await DiscordApi.getGuild(token, guildId);
    response.set(discordResult);
    return response;
  }
}

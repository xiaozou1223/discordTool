import { Injectable } from '@nestjs/common';
import { APIGuildChannel, APIGuildMember, APIRole } from 'discord-api-types/v10';
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
}

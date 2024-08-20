import { Injectable } from '@nestjs/common';
import { APIGuild, APIGuildChannel, APIGuildMember, APIMessage, APIRole, APIUser } from 'discord-api-types/v10';
import { DiscordApi } from 'src/discord.api';
import { DiscordChannel } from './dto/read-channel';
import { ApiResponse, APISearchMessage } from 'src/common.class';
import { ReadGuildsResponseDto } from './dto/read-guilds';

@Injectable()
export class GuildService {
  async getGuilds(token: string) {
    const response = new ApiResponse<ReadGuildsResponseDto[]>();
    const discordResult = await DiscordApi.getUserGuilds(token);
    const { data, ...result } = discordResult;
    const guildsData: ReadGuildsResponseDto[] = (data as APIGuild[]).map((item) => {
      return { id: item.id, icon: item.icon, name: item.name, owner: item.owner };
    });
    response.set(result);
    response.set({ data: guildsData });
    return response;
  }

  async getChannels(token: string, guildId: string): Promise<ApiResponse<DiscordChannel[]>> {
    const result = await DiscordApi.getChannels(token, guildId);
    const respone: ApiResponse<DiscordChannel[]> = new ApiResponse();
    const orginData = result.data!;
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

  async getRolesByGuildId(token: string, guildId: string): Promise<ApiResponse<APIRole[]>> {
    return await DiscordApi.getRolesByGuildId(token, guildId);
  }

  async getMemberByUserIdAndGuildId(token: string, guildId: string, userId: string): Promise<ApiResponse<APIGuildMember>> {
    return await DiscordApi.getMemberByUserIdAndGuildId(token, guildId, userId);
  }

  async getMember(token: string, guildId: string, discordUserId: string): Promise<ApiResponse<APIGuildMember>> {
    return await DiscordApi.getMember(token, guildId, discordUserId);
  }

  async searchMessage(token: string, guildId: string, queryString: string): Promise<ApiResponse<APISearchMessage>> {
    return await DiscordApi.searchMessage(token, guildId, queryString);
  }

  async deleteMessage(token: string, channelId: string, messageId: string): Promise<ApiResponse<null>> {
    return await DiscordApi.deleteMessage(token, channelId, messageId);
  }

  async getGuildInfo(token: string, guildId: string): Promise<ApiResponse<APIGuild>> {
    return await DiscordApi.getGuild(token, guildId);
  }
}

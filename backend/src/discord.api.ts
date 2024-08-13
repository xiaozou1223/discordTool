import axios from 'axios';
import { APIUser, APIGuild, APIGuildChannel, APIGuildMember, APIRole, APIMessage } from 'discord-api-types/v10';
import { ApiResponse } from './common.class';
import { HttpStatus } from '@nestjs/common';
import { APISearchMessage } from './common.class';

const host = 'https://discord.com/api';
const version = 'v10';

export const DiscordApi = {
  async getMe(token: string): Promise<ApiResponse<APIUser>> {
    const response = new ApiResponse<APIUser>();
    try {
      const dcResponse = await axios.get(`${host}/${version}/users/@me`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (dcResponse.status === HttpStatus.OK) {
        response.data = dcResponse.data as APIUser;
        response.message = '讀取成功';
        response.success = true;
        response.statusCode = HttpStatus.OK;
        return response;
      }
    } catch {}
    response.message = '驗證失敗';
    response.success = false;
    response.statusCode = HttpStatus.UNAUTHORIZED;
    return response;
  },

  async getMember(token: string, guildId: string, userId: string): Promise<ApiResponse<APIGuildMember>> {
    const response = new ApiResponse<APIGuildMember>();
    try {
      const dcResponse = await axios.get(`${host}/${version}/guilds/${guildId}/members/${userId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (dcResponse.status === HttpStatus.OK) {
        response.data = dcResponse.data as APIGuildMember;
        response.message = '讀取成功';
        response.success = true;
        response.statusCode = HttpStatus.OK;
        return response;
      }
    } catch {}
    response.message = '驗證失敗';
    response.success = false;
    response.statusCode = HttpStatus.UNAUTHORIZED;
    return response;
  },

  async getUserGuilds(token: string) {
    const response = new ApiResponse<APIGuild[]>();
    try {
      const dcResponse = await axios.get(`${host}/${version}/users/@me/guilds`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (dcResponse.status === HttpStatus.OK) {
        response.data = dcResponse.data as APIGuild[];
        response.message = '讀取成功';
        response.success = true;
        response.statusCode = HttpStatus.OK;
        return response;
      }
    } catch {}
    response.message = '驗證失敗';
    response.success = false;
    response.statusCode = HttpStatus.UNAUTHORIZED;
    return response;
  },

  async getGuild(token: string, guildId: string) {
    const response = new ApiResponse<APIGuild[]>();
    try {
      const dcResponse = await axios.get(`${host}/${version}/guilds/${guildId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (dcResponse.status === HttpStatus.OK) {
        response.data = dcResponse.data as APIGuild[];
        response.message = '讀取成功';
        response.success = true;
        response.statusCode = HttpStatus.OK;
        return response;
      }
    } catch {}
    response.message = '驗證失敗';
    response.success = false;
    response.statusCode = HttpStatus.UNAUTHORIZED;
    return response;
  },

  async getChannels(token: string, guildId: string) {
    const response = new ApiResponse<APIGuildChannel<any>[]>();
    try {
      const dcResponse = await axios.get(`${host}/${version}/guilds/${guildId}/channels`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (dcResponse.status === HttpStatus.OK) {
        response.data = dcResponse.data as APIGuildChannel<any>[];
        response.message = '讀取成功';
        response.success = true;
        response.statusCode = HttpStatus.OK;
        return response;
      }
    } catch {}
    response.message = '驗證失敗';
    response.success = false;
    response.statusCode = HttpStatus.UNAUTHORIZED;
    return response;
  },

  async getMemberByUserIdAndGuildId(token: string, guildId: string, userId: string) {
    const response = new ApiResponse<APIGuildMember[]>();
    try {
      const dcResponse = await axios.get(`${host}/${version}/guilds/${guildId}/members/${userId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (dcResponse.status === HttpStatus.OK) {
        response.data = dcResponse.data as APIGuildMember[];
        response.message = '讀取成功';
        response.success = true;
        response.statusCode = HttpStatus.OK;
        return response;
      }
    } catch {}
    response.message = '驗證失敗';
    response.success = false;
    response.statusCode = HttpStatus.UNAUTHORIZED;
    return response;
  },

  async getRolesByGuildId(token: string, guildId: string) {
    const response = new ApiResponse<APIRole[]>();
    try {
      const dcResponse = await axios.get(`${host}/${version}/guilds/${guildId}/roles`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (dcResponse.status === HttpStatus.OK) {
        response.data = dcResponse.data as APIRole[];
        response.message = '讀取成功';
        response.success = true;
        response.statusCode = HttpStatus.OK;
        return response;
      }
    } catch {}
    response.message = '驗證失敗';
    response.success = false;
    response.statusCode = HttpStatus.UNAUTHORIZED;
    return response;
  },

  async searchMessage(token: string, guildId: string, queryString: string) {
    const response = new ApiResponse<APISearchMessage>();
    try {
      const dcResponse = await axios.get(`${host}/${version}/guilds/${guildId}/messages/search?${queryString}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (dcResponse.status === HttpStatus.OK) {
        response.data = dcResponse.data as APISearchMessage;
        response.message = '讀取成功';
        response.success = true;
        response.statusCode = HttpStatus.OK;
        return response;
      }
    } catch {}
    response.message = '驗證失敗';
    response.success = false;
    response.statusCode = HttpStatus.UNAUTHORIZED;
    return response;
  },

  async deleteMessage(token: string, channelId: string, messageId: string) {
    const response = new ApiResponse<null>();
    try {
      const dcResponse = await axios.delete(`${host}/${version}/channels/${channelId}/messages/${messageId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (dcResponse.status === HttpStatus.OK) {
        response.message = '刪除成功';
        response.success = true;
        response.statusCode = HttpStatus.OK;
        return response;
      }
    } catch {}
    response.message = '驗證失敗';
    response.success = false;
    response.statusCode = HttpStatus.UNAUTHORIZED;
    return response;
  },
};

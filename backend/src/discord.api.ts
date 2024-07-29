import axios from 'axios';
import { APIUser, APIGuild, APIGuildChannel, APIGuildMember, APIRole } from 'discord-api-types/v10';
import { ApiResponse } from './common.class';
import { HttpStatus } from '@nestjs/common';

const host = 'https://discord.com/api';
const version = 'v10';

export const DiscordApi = {
  async getUser(token: string): Promise<ApiResponse<APIUser>> {
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

  async getGuilds(token: string) {
    const response = new ApiResponse<APIGuild>();
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

  async getChannels(token: string, guildId: string) {
    const response = new ApiResponse<APIGuildChannel<any>>();
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
    const response = new ApiResponse<APIGuildMember>();
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
    const response = new ApiResponse<APIRole>();
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
};

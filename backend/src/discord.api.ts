import axios, { AxiosError } from 'axios';
import { APIUser, APIGuild, APIGuildChannel, APIGuildMember, APIRole } from 'discord-api-types/v10';
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
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError;
        response.message = error.message;
        response.success = false;
        response.statusCode = error.status;
        return response;
      }
    }
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
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError;
        response.message = error.message;
        response.success = false;
        response.statusCode = error.status;
        return response;
      }
    }
  },

  async getUserGuilds(token: string): Promise<ApiResponse<APIGuild[]>> {
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
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError;
        response.message = error.message;
        response.success = false;
        response.statusCode = error.status;
        return response;
      }
    }
  },

  async getGuild(token: string, guildId: string): Promise<ApiResponse<APIGuild[]>> {
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
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError;
        response.message = error.message;
        response.success = false;
        response.statusCode = error.status;
        return response;
      }
    }
  },

  async getChannels(token: string, guildId: string): Promise<ApiResponse<APIGuildChannel<any>[]>> {
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
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError;
        response.message = error.message;
        response.success = false;
        response.statusCode = error.status;
        return response;
      }
    }
  },

  async getMemberByUserIdAndGuildId(token: string, guildId: string, userId: string): Promise<ApiResponse<APIGuildMember>> {
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
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError;
        response.message = error.message;
        response.success = false;
        response.statusCode = error.status;
        return response;
      }
    }
  },

  async getRolesByGuildId(token: string, guildId: string): Promise<ApiResponse<APIRole[]>> {
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
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError;
        response.message = error.message;
        response.success = false;
        response.statusCode = error.status;
        return response;
      }
    }
  },

  async searchMessage(token: string, guildId: string, queryString: string): Promise<ApiResponse<APISearchMessage>> {
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
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError;
        response.message = error.message;
        response.success = false;
        response.statusCode = error.status;
        return response;
      }
    }
  },

  async deleteMessage(token: string, channelId: string, messageId: string): Promise<ApiResponse<null>> {
    const response = new ApiResponse<null>();
    try {
      const dcResponse = await axios.delete(`${host}/${version}/channels/${channelId}/messages/${messageId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (dcResponse.status === HttpStatus.NO_CONTENT) {
        response.message = '刪除成功';
        response.success = true;
        response.statusCode = HttpStatus.OK;
        return response;
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError;
        response.message = error.message;
        response.success = false;
        response.statusCode = error.status;
        return response;
      }
    }
  },
};

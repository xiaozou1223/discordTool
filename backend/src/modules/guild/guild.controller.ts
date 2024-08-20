import { Controller, Delete, Get, Param, Query, Req, Res } from '@nestjs/common';
import { GuildService } from './guild.service';
import { UserService } from '../user/user.service';
import { Response, Request, query } from 'express';
import { ReadUserResponseDto } from '../user/dto/read-user.dto';
import * as jwtDecode from 'jwt-decode';
import { ApiResponse, APISearchMessage } from 'src/common.class';
import { APIGuild, APIGuildMember, APIMessage, APIRole, APIUser } from 'discord-api-types/v10';
import { channel } from 'process';
import { ReadGuildsResponseDto } from './dto/read-guilds';
import { HttpStatusCode } from 'axios';
import { DiscordChannel } from './dto/read-channel';
import { generateJwt } from 'src/jwt';

@Controller('/api/guild')
export class GuildController {
  constructor(
    private readonly guildService: GuildService,
    private readonly userService: UserService,
  ) {}

  @Get('/')
  async getGuilds(@Req() req: Request, @Res() res: Response) {
    const result: ApiResponse<ReadGuildsResponseDto[]> = await this.guildService.getGuilds(req.discordToken);
    if (result.statusCode === HttpStatusCode.Unauthorized) {
      await this.refreshDiscordTokenStatus(req, res);
    }
    return res.status(result.statusCode).send(result);
  }

  @Get(':guildId/channels')
  async getChannels(@Param('guildId') guildId: string, @Req() req: Request, @Res() res: Response) {
    const result: ApiResponse<DiscordChannel[]> = await this.guildService.getChannels(req.discordToken, guildId);
    if (result.statusCode === HttpStatusCode.Unauthorized) {
      await this.refreshDiscordTokenStatus(req, res);
    }
    return res.status(result.statusCode).send(result);
  }

  @Get(':guildId/members/:userId')
  async getMemberByUserIdAndGuildId(@Param('guildId') guildId: string, @Param('userId') userId: string, @Req() req: Request, @Res() res: Response) {
    const result: ApiResponse<APIGuildMember> = await this.guildService.getMemberByUserIdAndGuildId(req.discordToken, guildId, userId);
    if (result.statusCode === HttpStatusCode.Unauthorized) {
      await this.refreshDiscordTokenStatus(req, res);
    }
    return res.status(result.statusCode).send(result);
  }

  @Get(':guildId/roles')
  async getRolesByUserIdAndGuildId(@Param('guildId') guildId: string, @Req() req: Request, @Res() res: Response) {
    const result: ApiResponse<APIRole[]> = await this.guildService.getRolesByGuildId(req.discordToken, guildId);
    if (result.statusCode === HttpStatusCode.Unauthorized) {
      await this.refreshDiscordTokenStatus(req, res);
    }
    return res.status(result.statusCode).send(result);
  }

  @Get(':guildId')
  async getGuildInfo(@Param('guildId') guildId: string, @Req() req: Request, @Res() res: Response) {
    const result: ApiResponse<APIGuild> = await this.guildService.getGuildInfo(req.discordToken, guildId);
    if (result.statusCode === HttpStatusCode.Unauthorized) {
      await this.refreshDiscordTokenStatus(req, res);
    }
    return res.status(result.statusCode).send(result);
  }

  @Get(':guildId/members/:discordUserId')
  async getUser(@Param('guildId') guildId: string, @Param('discordUserId') discordUserId: string, @Req() req: Request, @Res() res: Response) {
    const result: ApiResponse<APIGuildMember> = await this.guildService.getMember(req.discordToken, guildId, discordUserId);
    if (result.statusCode === HttpStatusCode.Unauthorized) {
      await this.refreshDiscordTokenStatus(req, res);
    }
    return res.status(result.statusCode).send(result);
  }

  @Get(':guildId/messages/search')
  async searchMessage(@Param('guildId') guildId: string, @Query() query: string, @Req() req: Request, @Res() res: Response) {
    const queryString = req.originalUrl.split('?')[1];
    const result: ApiResponse<APISearchMessage> = await this.guildService.searchMessage(req.discordToken, guildId, queryString);
    if (result.statusCode === HttpStatusCode.Unauthorized) {
      await this.refreshDiscordTokenStatus(req, res);
    }
    return res.status(result.statusCode).send(result);
  }

  @Delete(':channelId/:messageId')
  async deleteMessage(@Param('channelId') channelId: string, @Param('messageId') messageId: string, @Req() req: Request, @Res() res: Response) {
    const result: ApiResponse<null> = await this.guildService.deleteMessage(req.discordToken, channelId, messageId);
    if (result.statusCode === HttpStatusCode.Unauthorized) {
      await this.refreshDiscordTokenStatus(req, res);
    }
    return res.status(result.statusCode).send(result);
  }

  async refreshDiscordTokenStatus(req: Request, res: Response) {
    const updateUserResult = await this.userService.update(req.user.account, { discordToken: req.discordToken }, res);
    const jwtResult = generateJwt(updateUserResult.data);
    res.cookie('jwt', jwtResult.accessToken, { httpOnly: false, path: '/', secure: false });
  }
}

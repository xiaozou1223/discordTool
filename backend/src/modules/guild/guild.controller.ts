import { Controller, Delete, Get, Param, Query, Req, Res } from '@nestjs/common';
import { GuildService } from './guild.service';
import { UserService } from '../user/user.service';
import { Response, Request, query } from 'express';
import { ReadUserResponseDto } from '../user/dto/read-user.dto';
import * as jwtDecode from 'jwt-decode';
import { ApiResponse } from 'src/common.class';
import { APIGuildMember, APIMessage, APIUser } from 'discord-api-types/v10';
import { channel } from 'process';

@Controller('/api/guild')
export class GuildController {
  constructor(
    private readonly guildService: GuildService,
    private readonly userService: UserService,
  ) {}

  @Get(':guildId/channels')
  async getGuilds(@Param('guildId') guildId: string, @Req() req: Request, @Res() res: Response) {
    const user = jwtDecode.jwtDecode(req.cookies['jwt']) as ReadUserResponseDto;
    const token = await this.userService.getToken(user.account);
    const result = await this.guildService.getChannels(token, guildId);
    return res.status(result.statusCode).send(result);
  }

  @Get(':guildId/members/:userId')
  async getMemberByUserIdAndGuildId(@Param('guildId') guildId: string, @Param('userId') userId: string, @Req() req: Request, @Res() res: Response) {
    const user = jwtDecode.jwtDecode(req.cookies['jwt']) as ReadUserResponseDto;
    const token = await this.userService.getToken(user.account);
    const result = await this.guildService.getMemberByUserIdAndGuildId(token, guildId, userId);
    return res.status(result.statusCode).send(result);
  }

  @Get(':guildId/roles')
  async getRolesByUserIdAndGuildId(@Param('guildId') guildId: string, @Req() req: Request, @Res() res: Response) {
    const user = jwtDecode.jwtDecode(req.cookies['jwt']) as ReadUserResponseDto;
    const token = await this.userService.getToken(user.account);
    const result = await this.guildService.getRolesByGuildId(token, guildId);
    return res.status(result.statusCode).send(result);
  }

  @Get(':guildId')
  async getGuildInfo(@Param('guildId') guildId: string, @Req() req: Request, @Res() res: Response) {
    const user = jwtDecode.jwtDecode(req.cookies['jwt']) as ReadUserResponseDto;
    const token = await this.userService.getToken(user.account);
    const result = await this.guildService.getGuildInfo(token, guildId);
    return res.status(result.statusCode).send(result);
  }

  @Get(':guildId/members/:discordUserId')
  async getUser(@Param('guildId') guildId: string, @Param('discordUserId') discordUserId: string, @Req() req: Request, @Res() res: Response) {
    const user = jwtDecode.jwtDecode(req.cookies['jwt']) as ReadUserResponseDto;
    const token = await this.userService.getToken(user.account);
    const result: ApiResponse<APIGuildMember> = await this.guildService.getMember(token, guildId, discordUserId);
    return res.status(result.statusCode).send(result);
  }

  @Get(':guildId/messages/search')
  async searchMessage(@Param('guildId') guildId: string, @Query() query: string, @Req() req: Request, @Res() res: Response) {
    const queryString = req.originalUrl.split('?')[1];
    const user = jwtDecode.jwtDecode(req.cookies['jwt']) as ReadUserResponseDto;
    const token = await this.userService.getToken(user.account);
    const result: ApiResponse<APIMessage> = await this.guildService.searchMessage(token, guildId, queryString);
    return res.status(result.statusCode).send(result);
  }

  @Delete(':guildId/members/:discordUserId')
  async deleteMessage(@Param('guildId') channelId: string, @Param('discordUserId') messageId: string, @Req() req: Request, @Res() res: Response) {
    const user = jwtDecode.jwtDecode(req.cookies['jwt']) as ReadUserResponseDto;
    const token = await this.userService.getToken(user.account);
    const result: ApiResponse<null> = await this.guildService.deleteMessage(token, channelId, messageId);
    return res.status(result.statusCode).send(result);
  }
}

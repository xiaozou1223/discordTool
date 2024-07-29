import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { GuildService } from './guild.service';
import { UserService } from '../user/user.service';
import { Response, Request } from 'express';
import { ReadUserResponseDto } from '../user/dto/read-user.dto';
import * as jwtDecode from 'jwt-decode';
import { ApiResponse } from 'src/common.class';
import { APIGuildMember, APIUser } from 'discord-api-types/v10';

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

  @Get(':guildId/members/:discordUserId')
  async getUser(@Param('guildId') guildId: string, @Param('discordUserId') discordUserId: string, @Req() req: Request, @Res() res: Response) {
    const user = jwtDecode.jwtDecode(req.cookies['jwt']) as ReadUserResponseDto;
    const result: ApiResponse<APIGuildMember> = await this.guildService.getMember(user.account, guildId, discordUserId);
    return res.status(result.statusCode).send(result);
  }
}

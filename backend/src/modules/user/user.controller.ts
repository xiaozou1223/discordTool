import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response, Request } from 'express';
import { ApiResponse } from '../../common.class';
import { User } from './entities/user.entity';
import { ReadUserResponseDto } from './dto/read-user.dto';
import { DeleteResult } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import * as jwtDecode from 'jwt-decode';
@Controller('/api/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const result: ApiResponse<User> = await this.userService.create(createUserDto);
    return res.status(result.statusCode).send(result);
  }

  @Get()
  async findOne(@Req() req: Request, @Res() res: Response) {
    const user: ReadUserResponseDto = jwtDecode.jwtDecode(req.cookies['jwt']);
    const result: ApiResponse<ReadUserResponseDto> = await this.userService.findOneByAccount(user.account);
    return res.status(result.statusCode).send(result);
  }

  @Patch()
  async update(@Req() req: Request, @Body() updateUserDto: UpdateUserDto, @Res() res: Response) {
    const user: ReadUserResponseDto = jwtDecode.jwtDecode(req.cookies['jwt']);
    const result: ApiResponse<ReadUserResponseDto> = await this.userService.update(user.account, updateUserDto, res);
    const jwtResult = await this.authService.login(result.data as ReadUserResponseDto);
    res.cookie('jwt', jwtResult.accessToken, { httpOnly: false, path: '/', secure: false });
    return res.status(result.statusCode).send(result);
  }

  @Delete(':account')
  async remove(@Param('account') account: string, @Res() res: Response) {
    const result: ApiResponse<DeleteResult> = await this.userService.remove(account);
    return res.status(result.statusCode).send(result);
  }
}

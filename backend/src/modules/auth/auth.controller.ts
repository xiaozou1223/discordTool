import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { ReadUserResponseDto } from '../user/dto/read-user.dto';
import { generateJwt } from 'src/jwt';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    const { account, password } = body;
    const result = await this.authService.validateUser(account, password);
    if (result.success) {
      const jwtResult = generateJwt(result.data as ReadUserResponseDto);
      res.cookie('jwt', jwtResult.accessToken, { httpOnly: false, path: '/', secure: false });
    }
    return res.status(result.statusCode).send(result);
  }
}

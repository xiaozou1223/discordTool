import { HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { ApiResponse } from 'src/common.class';
import { ReadUserResponseDto } from '../user/dto/read-user.dto';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(account: string, password: string): Promise<ApiResponse<ReadUserResponseDto>> {
    const response = new ApiResponse<ReadUserResponseDto>();
    const passwordHash = await this.userService.getPasswordHash(account);
    if (passwordHash && (await bcrypt.compare(password, passwordHash))) {
      const result = await this.userService.findOneByAccount(account);
      response.data = result.data;
      response.statusCode = HttpStatus.OK;
      response.success = true;
      response.message = '登入成功!';
      return response;
    } else {
      response.statusCode = HttpStatus.UNAUTHORIZED;
      response.success = false;
      response.message = '登入失敗!';
      return response;
    }
  }

  async login(user: ReadUserResponseDto) {
    const payload: ReadUserResponseDto = {
      account: user.account,
      discordUserId: user.discordUserId,
      discordUserData: user.discordUserData,
      isTokenValid: user.isTokenValid,
    };
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '5d' });
    return {
      accessToken,
    };
  }
}

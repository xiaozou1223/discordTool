/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ApiResponse } from '../../common.class';
import { ReadGuildsResponseDto as ReadGuildsDataResponseDto, ReadUserResponseDto } from './dto/read-user.dto';
import { DiscordApi } from 'src/discord.api';
import { APIGuild, APIUser } from 'discord-api-types/v10';
import * as crypto from 'crypto';
import { Response } from 'express';

const SALT_ROUNDS = 10;
const RESPONSE_MESSAGES = {
  ACCOUNT_ALREADY_EXISTS: {
    statusCode: HttpStatus.BAD_REQUEST,
    success: false,
    message: '帳號重複',
  },
  ACCOUNT_CREATED: {
    statusCode: HttpStatus.CREATED,
    success: true,
    message: '帳號創建成功',
  },
  ACCOUNT_NOT_FOUND: {
    statusCode: HttpStatus.BAD_REQUEST,
    success: false,
    message: '帳號不存在',
  },
  ACCOUNT_FOUND: {
    statusCode: HttpStatus.OK,
    success: true,
    message: '查詢成功',
  },
  ACCOUNT_UPDATED: {
    statusCode: HttpStatus.OK,
    success: true,
    message: '更新成功',
  },
  ACCOUNT_DELETED: {
    statusCode: HttpStatus.OK,
    success: true,
    message: '刪除成功',
  },
  TOKEN_INVALID: {
    statusCode: HttpStatus.UNAUTHORIZED,
    success: false,
    message: 'discord token無效',
  },
};

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<ApiResponse<User>> {
    const existsUSer = await this.userRepository.findOneBy({ account: createUserDto.account });
    const response = new ApiResponse<User>();
    if (existsUSer && existsUSer.discordUserId) {
      //如果該帳號未綁定過有效discord token的話，可以覆蓋註冊
      response.set(RESPONSE_MESSAGES.ACCOUNT_ALREADY_EXISTS);
      return response;
    }
    const user = new User();
    user.account = createUserDto.account;
    user.passwordHash = await bcrypt.hash(createUserDto.password, SALT_ROUNDS);
    await this.userRepository.save(user);
    response.set(RESPONSE_MESSAGES.ACCOUNT_CREATED);
    return response;
  }

  async findOneByAccount(account: string): Promise<ApiResponse<ReadUserResponseDto>> {
    const response = new ApiResponse<ReadUserResponseDto>();
    const isExists = await this.userRepository.existsBy({ account });
    if (!isExists) {
      response.set(RESPONSE_MESSAGES.ACCOUNT_NOT_FOUND);
      return response;
    }
    const { passwordHash, discordToken, ...userData } = await this.userRepository.findOneBy({ account });
    response.set({ data: userData });
    response.set(RESPONSE_MESSAGES.ACCOUNT_FOUND);
    return response;
  }

  async update(account: string, updateUserDto: UpdateUserDto, res: Response) {
    const response = new ApiResponse<ReadUserResponseDto>();
    const isExist = await this.userRepository.existsBy({ account });
    if (!isExist) {
      response.set(RESPONSE_MESSAGES.ACCOUNT_NOT_FOUND);
      return response;
    }
    const currentData = await this.userRepository.findOneBy({ account });
    if (updateUserDto.password) {
      currentData.passwordHash = await bcrypt.hash(updateUserDto.password, SALT_ROUNDS);
    }
    if (updateUserDto.discordToken !== undefined) {
      const discordResult = await DiscordApi.getUser(updateUserDto.discordToken);
      if (discordResult.success) {
        const discordUserId = (discordResult.data as APIUser).id;
        const sameDiscordUserIdUser = await this.userRepository.findOneBy({ discordUserId });
        if (sameDiscordUserIdUser && sameDiscordUserIdUser.account != account) {
          //如果有其他帳號綁定同一discord帳號的話,刪除該帳號
          await this.userRepository.delete(sameDiscordUserIdUser);
        }
        currentData.isTokenValid = true;
        currentData.discordUserId = discordUserId;
        currentData.discordToken = encrypt(updateUserDto.discordToken);
        currentData.discordUserData = discordResult.data as APIUser;
      } else if (updateUserDto.discordToken === null) {
        currentData.isTokenValid = false;
        currentData.discordToken = null;
      } else {
        currentData.isTokenValid = false;
        currentData.discordToken = encrypt(updateUserDto.discordToken);
      }
    }
    await this.userRepository.save(currentData);
    const { passwordHash, discordToken, ...userData } = await this.userRepository.findOneBy({ account });
    response.set({ data: userData });
    response.set(RESPONSE_MESSAGES.ACCOUNT_UPDATED);
    return response;
  }

  async remove(account: string) {
    const response = new ApiResponse<DeleteResult>();
    response.data = await this.userRepository.delete({ account });
    response.set(RESPONSE_MESSAGES.ACCOUNT_DELETED);
    return response;
  }

  async getGuilds(account: string) {
    const response = new ApiResponse<ReadGuildsDataResponseDto>();
    const isExist = await this.userRepository.existsBy({ account });
    if (!isExist) {
      response.set(RESPONSE_MESSAGES.ACCOUNT_NOT_FOUND);
      return response;
    }
    const token = await this.getToken(account);
    if (!token) {
      response.set(RESPONSE_MESSAGES.TOKEN_INVALID);
      return response;
    }
    const discordResult = await DiscordApi.getGuilds(token);
    const guildsData: ReadGuildsDataResponseDto[] = (discordResult.data as APIGuild[]).map((item) => {
      return { id: item.id, icon: item.icon, name: item.name };
    });
    response.set({ data: guildsData });
    response.set(RESPONSE_MESSAGES.ACCOUNT_FOUND);
    return response;
  }

  async getToken(account: string): Promise<string> {
    const isExist = await this.userRepository.existsBy({ account });
    if (!isExist) {
      return null;
    }
    const data = await this.userRepository.findOne({ where: { account }, select: ['isTokenValid', 'discordToken'] });
    if (data.isTokenValid) {
      return decrypt(data.discordToken);
    }
    return null;
  }

  async getPasswordHash(account: string): Promise<string> {
    const isExist = await this.userRepository.existsBy({ account });
    if (!isExist) {
      return null;
    }
    const data = await this.userRepository.findOne({ where: { account }, select: ['passwordHash'] });
    return data.passwordHash;
  }
}

function encrypt(text: string): string {
  const key = Buffer.from(process.env.CRYPTO_KEY, 'hex');
  const iv = Buffer.from(process.env.CRYPTO_IV, 'hex');
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(text: string): string {
  const key = Buffer.from(process.env.CRYPTO_KEY, 'hex');
  const iv = Buffer.from(process.env.CRYPTO_IV, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(text, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

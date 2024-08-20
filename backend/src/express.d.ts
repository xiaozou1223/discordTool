import { ReadUserResponseDto } from './modules/user/dto/read-user.dto';

declare module 'express' {
  export interface Request {
    user?: ReadUserResponseDto;
    discordToken?: string;
  }
}

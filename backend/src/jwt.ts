import * as jwt from 'jsonwebtoken';
import { ReadUserResponseDto } from './modules/user/dto/read-user.dto';
import { APIUser } from 'discord-api-types/v10';

const JWT_SECRET = process.env.JWT_SECRET;

export function generateJwt(user: ReadUserResponseDto) {
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

export function verifyJwt(token: string): ReadUserResponseDto | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as ReadUserResponseDto;
    return decoded;
  } catch (error) {
    return null;
  }
}

import { APIUser } from 'discord-api-types/v10';
import { User } from '../entities/user.entity';

type ReadUserType = Omit<User, 'passwordHash' | 'discordToken'>;
export class ReadUserResponseDto implements ReadUserType {
  account: string;
  discordUserData?: APIUser;
  isTokenValid: boolean;
  discordUserId?: string;
}

export class ReadGuildsResponseDto {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
}

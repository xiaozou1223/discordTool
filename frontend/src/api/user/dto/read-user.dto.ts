import type { APIUser } from 'discord-api-types/v10';

export class ReadUserResponseDto {
  account!: string;
  discordUserData?: APIUser;
  isTokenValid!: boolean;
  discordUserId?: string;
}

export class ReadGuildsResponseDto {
  id!: string;
  name!: string;
  icon: string | undefined;
  owner!: boolean;
}

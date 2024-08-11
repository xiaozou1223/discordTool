import type { APIUser } from 'discord-api-types/v10';

export class ReadUserResponseDto {
  account!: string;
  discordUserData?: APIUser;
  isTokenValid!: boolean;
  discordUserId?: string;
}

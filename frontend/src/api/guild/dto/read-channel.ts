import type { APIOverwrite } from 'discord-api-types/v10';

export class DiscordChannel {
  id!: string;
  name!: string;
  type!: number;
  parent_id!: string;
  permission_overwrites!: APIOverwrite[];
  position!: number;
}

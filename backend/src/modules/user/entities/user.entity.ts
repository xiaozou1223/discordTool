import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';
import { APIUser } from 'discord-api-types/v10';

@Entity()
@Unique(['discordUserId'])
export class User {
  @PrimaryColumn({ type: 'text' })
  account: string;

  @Column({ type: 'text' })
  passwordHash: string;

  @Column({ type: 'text', nullable: true })
  discordToken?: string | null;

  @Column({ type: 'bool' })
  isTokenValid: boolean = false;

  @Column({ type: 'text', nullable: true })
  discordUserId?: string | null;

  @Column({ type: 'jsonb', nullable: true })
  discordUserData?: APIUser | null;
}

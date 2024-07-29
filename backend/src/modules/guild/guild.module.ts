import { Module } from '@nestjs/common';
import { GuildService } from './guild.service';
import { GuildController } from './guild.controller';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

const entities = [User];

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers: [GuildController],
  providers: [GuildService, UserService],
})
export class GuildModule {}

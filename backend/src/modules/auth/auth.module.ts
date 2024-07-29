import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

const entities = [User];

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AuthModule {}

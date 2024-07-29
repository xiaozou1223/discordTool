import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';

const entities = [User];

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers: [UserController],
  providers: [UserService, AuthService],
})
export class UserModule {}

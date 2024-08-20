import { Module, NestMiddleware, MiddlewareConsumer } from '@nestjs/common';
import { JwtAuthMiddleware } from './jwtAuth.middleware';
import { UserService } from 'src/modules/user/user.service';
import { User } from 'src/modules/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

const entities = [User];

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [UserService, JwtAuthMiddleware],
  exports: [JwtAuthMiddleware],
})
export class JwtAuthMiddlewareModule {}

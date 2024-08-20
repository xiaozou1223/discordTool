import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@nestjs-modules/ioredis';
import { redisConfig, mongodbConfig, postgresConfig } from './database.config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { GuildModule } from './modules/guild/guild.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { JwtAuthMiddleware, routesRequiringJwtAuth, routesWithoutJwtAuth } from './middlewares/jwtAuth.middleware';
import { JwtAuthMiddlewareModule } from './middlewares/JwtAuth.middleware.module';
import { DiscordTokenAuthMiddleware, routesRequiringDiscordTokenAuth } from './middlewares/discordTokenAuth.middleware';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(postgresConfig),
    MongooseModule.forRootAsync(mongodbConfig),
    RedisModule.forRootAsync(redisConfig),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public/assets'),
      serveRoot: '/assets',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/assets/*'],
    }),
    UserModule,
    GuildModule,
    AuthModule,
    JwtAuthMiddlewareModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('api(/.*)?');
    consumer
      .apply(JwtAuthMiddleware)
      .exclude(...routesWithoutJwtAuth)
      .forRoutes(...routesRequiringJwtAuth);
    consumer.apply(DiscordTokenAuthMiddleware).forRoutes(...routesRequiringDiscordTokenAuth);
  }
}

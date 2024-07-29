import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { RedisModuleAsyncOptions, RedisModuleOptions } from '@nestjs-modules/ioredis';
import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const POSTGRES_HOST = process.env.POSTGRES_HOST;
const POSTGRES_PORT = Number(process.env.POSTGRES_PORT);
const POSTGRES_USER = process.env.POSTGRES_USER;
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
const POSTGRES_DB = process.env.POSTGRES_DB;

const MONGO_INITDB_ROOT_USERNAME = process.env.MONGO_INITDB_ROOT_USERNAME;
const MONGO_INITDB_ROOT_PASSWORD = process.env.MONGO_INITDB_ROOT_PASSWORD;
const MONGO_HOST = process.env.MONGO_HOST;
const MONGO_PORT = Number(process.env.MONGO_PORT);

const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = Number(process.env.REDIS_PORT);

export const postgresConfig: TypeOrmModuleAsyncOptions = {
  useFactory: () => ({
    type: 'postgres',
    host: POSTGRES_HOST,
    port: POSTGRES_PORT,
    username: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  }),
};
export const mongodbConfig: MongooseModuleAsyncOptions = {
  useFactory: () => ({
    uri: `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/`,
  }),
};
export const redisConfig: RedisModuleAsyncOptions = {
  useFactory: (): RedisModuleOptions => ({
    url: `redis://:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`,
    type: 'single',
  }),
};

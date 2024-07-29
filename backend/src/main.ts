import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as cookieParser from 'cookie-parser';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
const port = Number(process.env.BACKEND_PORT) || 8088;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.use(cookieParser());
  await app.listen(port);
  console.log(`run in ${port}`);
}
bootstrap();

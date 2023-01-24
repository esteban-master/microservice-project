import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CustomStrategy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { NatsJetStreamServer } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.set('trust proxy', true);
  const configService = app.get(ConfigService);
  await app.listen(3000);
}
bootstrap();

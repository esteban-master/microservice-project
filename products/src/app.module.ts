import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProductService } from './product.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import {
  NatsJetStreamClient,
  NatsJetStreamTransport,
} from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        NATS_URL: Joi.string().required(),
      }),
    }),
    NatsJetStreamTransport.register({
      connectionOptions: {
        servers: 'http://nats-srv:4222',
        name: 'products-publisher',
      },
    }),
  ],
  controllers: [AppController],
  providers: [ProductService, PrismaService, NatsJetStreamClient],
})
export class AppModule {}

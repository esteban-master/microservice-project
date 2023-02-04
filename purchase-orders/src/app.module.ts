import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { PurchaseOrderService } from './services/purchase-order.service';
import { PrismaService } from './prisma.service';
import { ProductService } from './services/product.service';
import {
  NatsJetStreamClient,
  NatsJetStreamTransport,
} from '@nestjs-plugins/nestjs-nats-jetstream-transport';

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
        name: 'purchase-orders-publisher',
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    PurchaseOrderService,
    ProductService,
    PrismaService,
    NatsJetStreamClient,
  ],
})
export class AppModule {}

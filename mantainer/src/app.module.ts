import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { EntitiesController } from './controllers/entities.controller';
import { ProductsController } from './controllers/products.controller';
import { EntitiesService } from './services/entities.service';
import { ProductsService } from './services/products.service';
import { ProvidersService } from './services/providers.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { ProvidersController } from './controllers/providers.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NatsJetStreamClient, NatsJetStreamTransport } from '@nestjs-plugins/nestjs-nats-jetstream-transport';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        NATS_URL: Joi.string().required()
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: 'MANTAINER_SERVICE',
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            servers: [configService.get('NATS_URL')],
          },
        }),
        inject: [ConfigService],
      },
    ]),
    NatsJetStreamTransport.register({
      connectionOptions: {
        servers: 'http://nats-srv:4222',
        name: 'mantainer-publisher',
      },
    }),
  ],
  controllers: [EntitiesController, ProvidersController, ProductsController],
  providers: [
    EntitiesService,
    ProductsService,
    ProvidersService,
    PrismaService,
    NatsJetStreamClient
  ],
})
export class AppModule {}

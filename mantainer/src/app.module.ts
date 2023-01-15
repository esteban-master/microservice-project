import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { EntitiesController } from './controllers/entities.controller';
import { ProductsController } from './controllers/products.controller';
import { EntitiesService } from './services/entities.service';
import { ProductsService } from './services/products.service';
import { ProvidersService } from './services/providers.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
      }),
    }),
  ],
  controllers: [EntitiesController, ProductsController],
  providers: [
    EntitiesService,
    ProductsService,
    ProvidersService,
    PrismaService,
  ],
})
export class AppModule {}

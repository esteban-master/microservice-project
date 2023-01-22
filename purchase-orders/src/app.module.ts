import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { PurchaseOrderService } from './services/purchase-order.service';
import { PrismaService } from './prisma.service';
import { ProductService } from './services/product.service';

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
  ],
  controllers: [AppController],
  providers: [PurchaseOrderService, ProductService, PrismaService],
})
export class AppModule {}

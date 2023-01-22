import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { PurchaseOrderService } from './purchase-order.service';
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
  controllers: [AppController],
  providers: [PurchaseOrderService, PrismaService],
})
export class AppModule {}

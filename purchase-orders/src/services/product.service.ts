import { NatsJetStreamContext } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async all() {
    return await this.prisma.product.findMany({});
  }

  async create(data: Product, context: NatsJetStreamContext) {
    await this.prisma.product.create({
      data: {
        name: data.name,
        id: data.id,
        version: data.version,
      },
    });
    context.message.ack();
  }

  async edit(data: Product, context: NatsJetStreamContext) {
    try {
      const product = await this.prisma.product.findFirst({
        where: { id: data.id, version: data.version - 1 },
      });

      if (product) {
        await this.prisma.product.update({
          where: {
            id: data.id,
          },
          data: {
            name: data.name,
            version: data.version,
          },
        });
        context.message.ack();
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async delete(
    productDeleteArgs: Prisma.ProductDeleteArgs,
    context: NatsJetStreamContext,
  ) {
    await this.prisma.product.delete(productDeleteArgs);
    context.message.ack();
  }
}

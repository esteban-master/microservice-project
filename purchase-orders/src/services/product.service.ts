import { NatsJetStreamContext } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async all() {
    return await this.prisma.product.findMany({}); 
  }

  async create(data: Prisma.ProductCreateInput, context: NatsJetStreamContext) {
    await this.prisma.product.create({
      data: {
        name: data.name,
        id: data.id,
        version: data.version,
      }
    })
    context.message.ack();
  }
  
  async edit(data: Prisma.ProductCreateInput, context: NatsJetStreamContext) {
    try {
      const product = await this.prisma.product.findFirst({ where: { id: data.id, version: data.version - 1 } }) 

      if (product) {
        await this.prisma.product.update({
          where: {
            id: data.id
          },
          data: {
            name: data.name,
            version: data.version,
          }
        })
        context.message.ack();
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Product } from '@prisma/client';
import { CreateProductDto } from '../dto/createProductDto';
import { ClientProxy } from '@nestjs/microservices';
import { NatsJetStreamClient } from '@nestjs-plugins/nestjs-nats-jetstream-transport';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService, private natsClient: NatsJetStreamClient) {}

  async all(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  async create(product: CreateProductDto): Promise<Product> {
    const newProduct = await this.prisma.product.create({
      data: product,
    });
    this.natsClient.emit('product.create', newProduct);
    return newProduct;
  }
}

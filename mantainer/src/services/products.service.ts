import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Product } from '@prisma/client';
import { CreateProductDto } from '../dto/createProductDto';
import { ClientProxy } from '@nestjs/microservices';
import { NatsJetStreamClient } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { EditProductDto } from 'src/dto/editProductDto';

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

  async edit(product: EditProductDto, productId: string){
    await this.findUnique({ id: parseInt(productId) })

    try {
      const productUpdate = await this.prisma.product.update({
        where: {
          id: parseInt(productId),
        },
        data: {
          name: product.name,
          version: {
            increment: 1
          },
          code: product.code
        }
      })
  
      this.natsClient.emit('product.update', productUpdate)
      return productUpdate;
    } catch (error) {
      throw new InternalServerErrorException('Error update product')      
    }
  }

  async findUnique(productWhereUniqueInput: Prisma.ProductWhereUniqueInput) {
    const find = await this.prisma.product.findUnique({ where: productWhereUniqueInput })
    if (find) {
      return find;
    }
    throw new NotFoundException('Product not found');
    
  }
}

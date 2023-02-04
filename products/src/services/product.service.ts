import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';
import { NatsJetStreamClient } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { EditProductDto } from 'src/dto/editProductDto';
import { PrismaService } from '../prisma.service';
import { CreateProductDto } from '../dto/createProductDto';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private natsClient: NatsJetStreamClient,
  ) {}

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

  async edit(product: EditProductDto, productId: string) {
    await this.findUnique({ id: parseInt(productId) });

    try {
      const productUpdate = await this.prisma.product.update({
        where: {
          id: parseInt(productId),
        },
        data: {
          name: product.name,
          code: product.code,
          version: {
            increment: 1,
          },
        },
      });
      this.natsClient.emit('product.update', productUpdate);
      return productUpdate;
    } catch (error) {
      throw new InternalServerErrorException('Error update product');
    }
  }

  async delete(productWhereUniqueInput: Prisma.ProductWhereUniqueInput) {
    const count = await this.prisma.line.count({
      where: { productId: productWhereUniqueInput.id },
    });

    if (count > 0) {
      throw new BadRequestException(
        'Este producto tiene asociado movimientos de inventario',
      );
    }

    return await this.prisma.product.delete({
      where: productWhereUniqueInput,
    });
  }

  async findUnique(productWhereUniqueInput: Prisma.ProductWhereUniqueInput) {
    const find = await this.prisma.product.findUnique({
      where: productWhereUniqueInput,
    });
    if (find) {
      return find;
    }
    throw new NotFoundException('Product not found');
  }
}

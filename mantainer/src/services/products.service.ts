import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Product } from '@prisma/client';
import { CreateProductDto } from '../dto/createProductDto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async all(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  async create(product: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({
      data: product,
    });
  }
}

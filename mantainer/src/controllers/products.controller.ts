import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dto/createProductDto';

@Controller('mantainer/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  all() {
    return this.productsService.all();
  }

  @Post()
  create(@Body() product: CreateProductDto) {
    return this.productsService.create(product);
  }
}

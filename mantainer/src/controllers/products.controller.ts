import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dto/createProductDto';
import { EditProductDto } from 'src/dto/editProductDto';

@Controller('/api/mantainer/products')
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

  @Put('/:id')
  update(@Param('id') productId: string, @Body() product: EditProductDto) {
    return this.productsService.edit(product, productId);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { EditProductDto } from 'src/dto/editProductDto';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/createProductDto';

@Controller('/api/products')
export class AppController {
  constructor(private readonly productsService: ProductService) {}

  @Get()
  all() {
    return this.productsService.all();
  }

  @Get('/:id')
  getProduct(@Param('id') id: string) {
    return this.productsService.findUnique({ id: Number(id) });
  }

  @Post()
  create(@Body() product: CreateProductDto) {
    return this.productsService.create(product);
  }

  @Put('/:id')
  update(@Param('id') productId: string, @Body() product: EditProductDto) {
    return this.productsService.edit(product, productId);
  }

  @Delete('/:id')
  delete(@Param('id') productId: string) {
    return this.productsService.delete({ id: Number(productId) });
  }
}

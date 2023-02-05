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
import { ProductService } from './services/product.service';
import { CreateProductDto } from './dto/createProductDto';
import { Ctx, EventPattern, Payload } from '@nestjs/microservices';
import { NatsJetStreamContext } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { LineService } from './services/line.service';
import { Line } from '@prisma/client';
@Controller('/api/products')
export class AppController {
  constructor(
    private readonly productsService: ProductService,
    private readonly lineService: LineService,
  ) {}

  @Get()
  all() {
    return this.productsService.all();
  }

  @Get('/lines/all')
  allLines() {
    return this.lineService.all();
  }

  @Get('/:id')
  getProduct(@Param('id') id: string) {
    return this.productsService.findUnique({ id: Number(id) });
  }

  @Get('/:id/lines')
  allLinesByProductId(@Param('id') productId: string) {
    return this.lineService.allByProductId({ productId: Number(productId) });
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

  @EventPattern('line.create')
  public async createLineEvent(
    @Payload() data: Line[],
    @Ctx() context: NatsJetStreamContext,
  ) {
    this.lineService.create(data, context);
  }

  @EventPattern('line.update')
  public async updateLineEvent(
    @Payload() data: Line[],
    @Ctx() context: NatsJetStreamContext,
  ) {
    this.lineService.update(data, context);
  }

  @EventPattern('line.delete')
  public async deleteLineEvent(
    @Payload() data: string[],
    @Ctx() context: NatsJetStreamContext,
  ) {
    this.lineService.delete(data, context);
  }
}

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PurchaseOrderService } from './services/purchase-order.service';
import { CreatePurchaseOrderDto } from './dto/createPurchaseOrderDto';
import { Ctx, EventPattern, Payload } from '@nestjs/microservices';
import { NatsJetStreamContext } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { ProductService } from './services/product.service';

@Controller('/api/purchase-orders')
export class AppController {
  constructor(
    private readonly purchaseOrderService: PurchaseOrderService,
    private readonly productService: ProductService,
  ) {}

  @Get()
  async all() {
    const purchaseOrders = await this.purchaseOrderService.all();
    const products = await this.productService.all();
    return {
      purchaseOrders,
      products,
    };
  }

  @Get('/:id')
  async get(@Param('id') id: string) {
    return await this.purchaseOrderService.findUnique({ id: Number(id) });
  }

  @Post()
  async create(@Body() createPurchaseOrderDto: CreatePurchaseOrderDto) {
    return this.purchaseOrderService.create(createPurchaseOrderDto);
  }

  @EventPattern('product.create')
  public async createdProductEvent(
    @Payload() data: { id: number; name: string; version: number },
    @Ctx() context: NatsJetStreamContext,
  ) {
    this.productService.create(data, context);
  }

  @EventPattern('product.update')
  public async updateProductEvent(
    @Payload() data: any,
    @Ctx() context: NatsJetStreamContext,
  ) {
    this.productService.edit(data, context);
  }
}

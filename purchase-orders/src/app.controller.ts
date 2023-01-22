import { Controller, Get, Post } from '@nestjs/common';
import { PurchaseOrderService } from './purchase-order.service';
import { CreatePurchaseOrderDto } from './dto/createPurchaseOrderDto';
import { Ctx, EventPattern, Payload } from '@nestjs/microservices';
import { NatsJetStreamContext } from '@nestjs-plugins/nestjs-nats-jetstream-transport';

@Controller('purchase-orders')
export class AppController {
  constructor(private readonly purchaseOrderService: PurchaseOrderService) {}

  @Get()
  async all() {
    return this.purchaseOrderService.all();
  }

  @Post()
  async create(createPurchaseOrderDto: CreatePurchaseOrderDto) {
    return this.purchaseOrderService.create(createPurchaseOrderDto);
  }

  @EventPattern('product.create')
  public async updatedCreatedEvent(
    @Payload() data: { id: number, name: string, version: number },
    @Ctx() context: NatsJetStreamContext,
  ) {
    this.purchaseOrderService.createProduct(data, context);
  }
}

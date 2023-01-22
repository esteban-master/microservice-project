import { Controller, Get, Post } from '@nestjs/common';
import { PurchaseOrderService } from './purchase-order.service';
import { CreatePurchaseOrderDto } from './dto/createPurchaseOrderDto';

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
}

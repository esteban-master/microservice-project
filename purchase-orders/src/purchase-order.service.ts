import { Injectable } from '@nestjs/common';
import { CreatePurchaseOrderDto } from './dto/createPurchaseOrderDto';
import { PrismaService } from './prisma.service';

@Injectable()
export class PurchaseOrderService {
  constructor(private prisma: PrismaService) {}

  async all() {
    return this.prisma.purchaseOrder.findMany();
  }

  async create(createPurchaseOrder: CreatePurchaseOrderDto) {
    // const lines = createPurchaseOrder.lines;
    // for (let line of lines) {
    //   await this.prisma.productLine.create({ data: {
    //     productId: line.productId,
    //   }}) 
    // }
    

    // const newPurchaseOrder = await this.prisma.purchaseOrder.create({
    //   data: {
    //     description: 'Hola',
    //     expirationDate: new Date(),
    //     issueDate: new Date(),
    //   }
    // });

    // const purchaseOrderLine = await this.prisma.purchaseOrderLine.create({
    //   data: {
    //     purchaseOrderId: createPurchaseOrder.id,
    //     productLineId: productLine.id
    //   },
    // })
    return {};
  }
}

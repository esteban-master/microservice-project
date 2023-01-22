import { NatsJetStreamContext } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreatePurchaseOrderDto } from './dto/createPurchaseOrderDto';
import { PrismaService } from './prisma.service';

@Injectable()
export class PurchaseOrderService {
  constructor(private prisma: PrismaService) {}

  async all() {
    const po = await this.prisma.purchaseOrder.findMany();
    const products = await this.prisma.product.findMany();
    return {
      po, products
    }
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

  async createProduct(data: Prisma.ProductCreateInput, context: NatsJetStreamContext) {
    await this.prisma.product.create({
      data: {
        name: data.name,
        id: data.id,
        version: data.version,
      }
    })
    context.message.ack();
  }
}

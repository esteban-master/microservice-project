import { Injectable } from '@nestjs/common';
import { CreatePurchaseOrderDto } from '../dto/createPurchaseOrderDto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PurchaseOrderService {
  constructor(private prisma: PrismaService) {}

  async all() {
    return await this.prisma.purchaseOrder.findMany({
      include: {
        purchaseOrderLines: {
          select: {
            productLine: {
              select: {
                product: {}
              }
            }
          }
        }
      }
    }); 
  }

  async create(createPurchaseOrder: CreatePurchaseOrderDto) {
    const lines = createPurchaseOrder.lines;
    const newPurchaseOrder = this.prisma.purchaseOrder.create({
      data: {
        description: createPurchaseOrder.description,
        expirationDate: createPurchaseOrder.expirationDate,
        issueDate: createPurchaseOrder.issueDate,
        purchaseOrderLines: {
          create: lines.map(item => ({
            productLine: {
              create: {
                productId: item.productId
              }
            }}))
        }
      }
    })
  return newPurchaseOrder;
  }
}

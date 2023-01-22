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
                line: {},
                product: {
                  select: {
                    name: true, id: true
                  }
                }
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
                product: {
                  connect: {
                    id: item.productId
                  }
                },
                line: {
                  create: {
                    price: item.price, quantity: item.quantity
                  },
                }
              }
            }
          }))
        }
      }
    })
  return newPurchaseOrder;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePurchaseOrderDto } from '../dto/createPurchaseOrderDto';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

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
                id: true,
                line: {},
                product: {
                  select: {
                    name: true,
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
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
          create: lines.map((item) => ({
            productLine: {
              create: {
                product: {
                  connect: {
                    id: item.productId,
                  },
                },
                line: {
                  create: {
                    price: item.price,
                    quantity: item.quantity,
                  },
                },
              },
            },
          })),
        },
      },
      include: {
        purchaseOrderLines: {
          include: {
            productLine: {
              include: {
                line: {},
                product: {},
              },
            },
          },
        },
      },
    });
    return newPurchaseOrder;
  }

  async findUnique(
    purchaseOrderWhereUniqueInput: Prisma.PurchaseOrderWhereUniqueInput,
  ) {
    const find = await this.prisma.purchaseOrder.findUnique({
      where: purchaseOrderWhereUniqueInput,
      include: {
        purchaseOrderLines: {
          include: {
            productLine: {
              include: { line: {}, product: {} },
            },
          },
        },
      },
    });
    if (find) {
      return find;
    }
    throw new NotFoundException('Purchase order not found');
  }
}

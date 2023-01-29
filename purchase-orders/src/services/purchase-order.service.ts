import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePurchaseOrderDto } from '../dto/createPurchaseOrderDto';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { EditPurchaseOrderDto } from 'src/dto/editPurchaseOrderDto';

@Injectable()
export class PurchaseOrderService {
  constructor(private prisma: PrismaService) {}

  async test() {
    const purchaseOrder = await this.prisma.purchaseOrder.findMany();
    const purchaseOrderLine = await this.prisma.purchaseOrderLine.findMany();
    const prodcutLine = await this.prisma.productLine.findMany();
    const line = await this.prisma.line.findMany();
    return {
      purchaseOrder,
      purchaseOrderLine,
      prodcutLine,
      line,
    };
  }

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

  async update(
    editPurchaseOrderDto: EditPurchaseOrderDto,
    purchaseOrderWhereUniqueInput: Prisma.PurchaseOrderWhereUniqueInput,
  ) {
    try {
      return await this.prisma.purchaseOrder.update({
        where: purchaseOrderWhereUniqueInput,
        data: {
          description: editPurchaseOrderDto.description,
          issueDate: editPurchaseOrderDto.issueDate,
          expirationDate: editPurchaseOrderDto.expirationDate,
          purchaseOrderLines: {
            // delete: {
            // }
          },
        },
      });
    } catch (error) {}
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

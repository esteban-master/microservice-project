import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
    const line = await this.prisma.line.findMany();
    const prdoucts = await this.prisma.product.findMany();
    return {
      purchaseOrder,
      purchaseOrderLine,
      line,
      prdoucts,
    };
  }

  async all() {
    return await this.prisma.purchaseOrder.findMany({
      include: {
        purchaseOrderLines: {
          select: {
            id: true,
            line: {
              include: {
                product: {},
              },
            },
            // productLine: {
            //   select: {
            //     id: true,
            //     line: {},
            //     product: {
            //       select: {
            //         name: true,
            //         id: true,
            //       },
            //     },
            //   },
            // },
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
            line: {
              create: {
                price: item.price,
                quantity: item.quantity,
                product: {
                  connect: {
                    id: item.productId,
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
            line: {
              include: {
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
      const updatePurchaseOrder = this.prisma.purchaseOrder.update({
        where: purchaseOrderWhereUniqueInput,
        data: {
          description: editPurchaseOrderDto.description,
          issueDate: editPurchaseOrderDto.issueDate,
          expirationDate: editPurchaseOrderDto.expirationDate,
          purchaseOrderLines: {
            upsert: editPurchaseOrderDto.lines.map((item) => ({
              create: {
                line: {
                  create: {
                    price: item.price,
                    quantity: item.quantity,
                    product: {
                      connect: {
                        id: item.productId,
                      },
                    },
                  },
                },
              },
              where: { id: item.purchaseOrderLineId },
              update: {
                line: {
                  update: {
                    price: item.price,
                    quantity: item.quantity,
                    product: {
                      connect: {
                        id: item.productId,
                      },
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
              line: {
                include: {
                  product: {},
                },
              },
            },
          },
        },
      });

      const deleteLines = this.prisma.line.deleteMany({
        where: {
          id: {
            in: editPurchaseOrderDto.deleteLinesIds,
          },
        },
      });
      const [purchaseOrderUpdated] = await this.prisma.$transaction([
        updatePurchaseOrder,
        deleteLines,
      ]);

      return purchaseOrderUpdated;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findUnique(
    purchaseOrderWhereUniqueInput: Prisma.PurchaseOrderWhereUniqueInput,
  ) {
    const find = await this.prisma.purchaseOrder.findUnique({
      where: purchaseOrderWhereUniqueInput,
      include: {
        purchaseOrderLines: {
          include: {
            line: {
              include: {
                product: {},
              },
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

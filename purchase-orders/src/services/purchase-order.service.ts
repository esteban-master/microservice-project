import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePurchaseOrderDto } from '../dto/createPurchaseOrderDto';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { EditPurchaseOrderDto } from 'src/dto/editPurchaseOrderDto';
import { v4 as uuidv4 } from 'uuid';
import { NatsJetStreamClient } from '@nestjs-plugins/nestjs-nats-jetstream-transport';

@Injectable()
export class PurchaseOrderService {
  constructor(
    private prisma: PrismaService,
    private natsClient: NatsJetStreamClient,
  ) {}

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
          },
        },
      },
    });
  }

  async create(createPurchaseOrder: CreatePurchaseOrderDto) {
    const lines = createPurchaseOrder.lines;
    const newPurchaseOrder = await this.prisma.purchaseOrder.create({
      data: {
        description: createPurchaseOrder.description,
        expirationDate: createPurchaseOrder.expirationDate,
        issueDate: createPurchaseOrder.issueDate,
        purchaseOrderLines: {
          create: lines.map((item) => ({
            line: {
              create: {
                id: `purchase-orders-${uuidv4()}`,
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
    const newLines = newPurchaseOrder.purchaseOrderLines.map((item) => ({
      id: item.line.id,
      price: item.line.price,
      quantity: item.line.quantity,
      createdAt: item.line.createdAt,
      productId: item.line.productId,
    }));
    this.natsClient.emit('line.create', newLines);
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
                    id: `purchase-orders-${uuidv4()}`,
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

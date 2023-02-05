import { Injectable } from '@nestjs/common';
import { Line, Prisma } from '@prisma/client';
import { NatsJetStreamContext } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LineService {
  constructor(private prisma: PrismaService) {}

  async all(): Promise<Line[]> {
    return this.prisma.line.findMany();
  }

  async allByProductId(lineWhereInput: Prisma.LineWhereInput): Promise<Line[]> {
    return this.prisma.line.findMany({
      where: lineWhereInput,
    });
  }

  async create(lines: Line[], context: NatsJetStreamContext) {
    await this.prisma.line.createMany({
      data: lines,
    });
    context.message.ack();
  }

  async update(lines: Line[], context: NatsJetStreamContext) {
    await this.prisma.$transaction(
      lines.map((item) =>
        this.prisma.line.update({
          where: {
            id: item.id,
          },
          data: {
            price: item.price,
            quantity: item.quantity,
            product: {
              connect: {
                id: item.productId,
              },
            },
          },
        }),
      ),
    );

    context.message.ack();
  }

  async delete(linesIds: string[], context: NatsJetStreamContext) {
    await this.prisma.line.deleteMany({
      where: {
        id: {
          in: linesIds,
        },
      },
    });
    context.message.ack();
  }
}

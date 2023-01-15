import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Provider } from '@prisma/client';

@Injectable()
export class ProvidersService {
  constructor(private prisma: PrismaService) {}

  async all(): Promise<Provider[]> {
    return this.prisma.provider.findMany();
  }
}

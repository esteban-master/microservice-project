import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Provider } from '@prisma/client';
import { CreateProviderDto } from 'src/dto/createProviderDto';

@Injectable()
export class ProvidersService {
  constructor(private prisma: PrismaService) {}

  async all(): Promise<Provider[]> {
    return this.prisma.provider.findMany();
  }

  async create(provider: CreateProviderDto): Promise<Provider> {
    return this.prisma.provider.create({ data: provider });
  }
}

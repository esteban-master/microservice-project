import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Entity } from '@prisma/client';
import { CreateEntityDto } from '../dto/createEntityDto';

@Injectable()
export class EntitiesService {
  constructor(private prisma: PrismaService) {}

  async all(): Promise<Entity[]> {
    return this.prisma.entity.findMany();
  }

  async create(entity: CreateEntityDto): Promise<Entity> {
    return this.prisma.entity.create({
      data: entity,
    });
  }
}

import { Body, Controller, Get, Post } from '@nestjs/common';
import { EntitiesService } from '../services/entities.service';
import { CreateEntityDto } from '../dto/createEntityDto';

@Controller('/api/mantainer/entities')
export class EntitiesController {
  constructor(private readonly entitiesService: EntitiesService) {}

  @Get()
  all() {
    return this.entitiesService.all();
  }

  @Post()
  create(@Body() entity: CreateEntityDto) {
    return this.entitiesService.create(entity);
  }
}

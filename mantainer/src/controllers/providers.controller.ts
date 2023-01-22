import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProvidersService } from 'src/services/providers.service';
import { CreateProviderDto } from 'src/dto/createProviderDto';

@Controller('/api/mantainer/providers')
export class ProvidersController {
  constructor(private readonly providerService: ProvidersService) {}

  @Get()
  all() {
    return this.providerService.all();
  }

  @Post()
  create(@Body() product: CreateProviderDto) {
    return this.providerService.create(product);
  }
}

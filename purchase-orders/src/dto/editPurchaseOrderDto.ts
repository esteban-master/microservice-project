import { PartialType } from '@nestjs/mapped-types';
import { CreatePurchaseOrderDto } from './createPurchaseOrderDto';

export class EditPurchaseOrderDto extends PartialType(CreatePurchaseOrderDto) {}

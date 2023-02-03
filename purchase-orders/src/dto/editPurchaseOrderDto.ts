import { PartialType } from '@nestjs/mapped-types';
import { CreatePurchaseOrderDto } from './createPurchaseOrderDto';
import { ArrayMinSize, IsArray, IsNotEmpty } from 'class-validator';

export class EditPurchaseOrderDto extends PartialType(CreatePurchaseOrderDto) {
  @IsNotEmpty()
  @ArrayMinSize(0)
  @IsArray()
  deleteLinesIds: string[];
}

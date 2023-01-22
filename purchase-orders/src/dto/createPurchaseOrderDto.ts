import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsDate, IsNotEmpty, IsNumber, IsString, MinLength, ValidateNested } from 'class-validator';

class LineDto {
    @IsNotEmpty()
    @IsNumber()
    readonly productId: number;
}

export class CreatePurchaseOrderDto {
  @IsNotEmpty()
  @IsString()
  readonly issueDate: string;

  @IsNotEmpty()
  @IsString()
  readonly expirationDate: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  readonly description: string;

  @IsNotEmpty()
  @ArrayMinSize(1)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LineDto)
  lines: LineDto[]
}

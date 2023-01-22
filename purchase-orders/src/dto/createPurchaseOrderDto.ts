import { ArrayMinSize, IsArray, IsDate, IsNotEmpty, IsNumber, IsString, MinLength, ValidateNested } from 'class-validator';

class LineDto {
    @IsNotEmpty()
    @IsNumber()
    readonly productId: number;
}

export class CreatePurchaseOrderDto {
  @IsNotEmpty()
  @IsDate()
  @IsString()
  readonly issueDate: Date;

  @IsNotEmpty()
  @IsDate()
  @IsString()
  readonly expirationDate: Date;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  readonly description: string;

  @IsNotEmpty()
  @ArrayMinSize(1)
  @IsArray()
  @ValidateNested({ each: true })
  lines: LineDto[]
}

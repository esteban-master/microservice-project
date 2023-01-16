import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class CreateProviderDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  readonly companyEmail: string;

  @IsNotEmpty()
  @IsNumber()
  @MinLength(3)
  readonly entityId: number;
}

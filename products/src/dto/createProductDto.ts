import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  readonly code: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  readonly name: string;
}

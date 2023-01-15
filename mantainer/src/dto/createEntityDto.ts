import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateEntityDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  readonly name: string;
}

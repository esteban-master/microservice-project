import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateProductDto } from './createProductDto';

export class EditProductDto extends PartialType(CreateProductDto) {}
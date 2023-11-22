import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsInt()
  stock?: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive: boolean = true;

  @IsOptional()
  @IsArray()
  @IsNumber({}, {each: true})
  categoryIds?: number[];
}

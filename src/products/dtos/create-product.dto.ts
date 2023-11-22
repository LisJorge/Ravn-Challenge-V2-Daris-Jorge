import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({
    example: 'My product name',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'https://image.domain.com/my-image-url',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  imageUrl: string;

  @ApiProperty({
    example: 100,
    required: false,
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  stock?: number;

  @ApiProperty({
    example: 10.95,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 'My product specifications',
    required: false,
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: true,
    required: false,
    description: 'When is not specified the default value set is true',
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive: boolean = true;

  @ApiProperty({
    example: [1, 2],
    required: false,
    isArray: true,
    type: Number
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  categoryIds?: number[];
}

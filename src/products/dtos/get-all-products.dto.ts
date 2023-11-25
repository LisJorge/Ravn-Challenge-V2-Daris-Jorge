import { PaginationDto } from '@/common/dto';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional } from 'class-validator';

export class GetAllProductsDto extends PaginationDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  categoryId?: number;

  @IsOptional()
  @IsBoolean()
  isActive: boolean = true;
}

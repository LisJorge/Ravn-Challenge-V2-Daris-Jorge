import { IsInt, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dto';

export class GetAllProductsDto extends PaginationDto {
  @IsOptional()
  @IsInt()
  categoryId?: number;
}

import { Expose, Transform } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";

export class PaginationDto{
  @Expose()
  @Transform(({value}) => {return value ? value : 10})
  @IsOptional()
  @IsInt()
  take?: number;

  @Expose()
  @Transform(({value}) => {return value ? value : 0})
  @IsOptional()
  @IsInt()
  skip?: number;
}
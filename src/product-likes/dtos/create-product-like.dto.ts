import { IsInt, IsNotEmpty, IsNumber } from "class-validator";

export class ProductLikeDto {
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  userId: number;
}
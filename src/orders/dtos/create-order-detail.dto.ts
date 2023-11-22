import { IsInt, IsNotEmpty, IsNumber, Min } from "class-validator";

export class CreateOrderDetailDto {
  @IsNotEmpty()
  @IsInt()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;  
}
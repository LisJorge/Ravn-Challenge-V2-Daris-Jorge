import { IsInt, IsNotEmpty } from "class-validator";

export class CreateCartDto {
  @IsNotEmpty()
  @IsInt()
  productId: number;

  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsInt()
  quantity: number;
}
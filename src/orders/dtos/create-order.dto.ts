import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, Min, ValidateNested } from "class-validator";
import { CreateOrderDetailDto } from "./create-order-detail.dto";

export class CreateOrderDto{
  @IsNotEmpty()
  userId: number;
  
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateOrderDetailDto)
  orderDetails: CreateOrderDetailDto[];
}
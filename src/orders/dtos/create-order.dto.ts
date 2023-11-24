import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { CreateOrderDetailDto } from './create-order-detail.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    required: true,
    isArray: true,
    example: [{
      productId: 1,
      quantity: 10,
      price: 5.00
    }],
    type: () => CreateOrderDetailDto
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateOrderDetailDto)
  orderDetails: CreateOrderDetailDto[];
}

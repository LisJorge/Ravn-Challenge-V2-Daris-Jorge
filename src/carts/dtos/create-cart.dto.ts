import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateCartDto {
  @ApiProperty({
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  @IsInt()
  productId: number;

  @ApiProperty({
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @ApiProperty({
    example: 10,
    required: true,
  })
  @IsNotEmpty()
  @IsInt()
  quantity: number;
}

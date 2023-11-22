import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateCartDto {
  @ApiProperty({
    example: 10,
    required: true
  })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

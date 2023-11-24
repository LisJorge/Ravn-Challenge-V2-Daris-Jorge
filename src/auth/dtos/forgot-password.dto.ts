import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'email@example.com',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  email: string;
}
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ResetPasswordDto {
  @ApiProperty({
    example: 'mySecretPassword',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    example: 'myToken',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  token: string;
}
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignUpUserDto {
  @ApiProperty({
    example: 'John',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Doe',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @ApiProperty({
    example: 'jonh.doe@example.com',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'mySecretPassword',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../services';
import { Request } from 'express';
import { AuthUserDto, SignUpUserDto } from '../dtos';
import { AuthGuard } from '@nestjs/passport';
import { Public } from '../decorators';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthResponseDto } from '../dtos/auth-response.dto';
import { GENERAL_RESPONSE, UNAUTHORIZED_RESPONSE } from 'src/common/api-responses';

@Public()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService){}
  
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiResponse(GENERAL_RESPONSE)
  @ApiResponse(UNAUTHORIZED_RESPONSE)
  login(@Req() req:Request): AuthResponseDto {
    const user = req.user as AuthUserDto;
    return this.authService.generateJwt(user); 
  }

  @Post('sing-up')
  @ApiResponse(GENERAL_RESPONSE)
  signUp(@Body() signUpUserDto: SignUpUserDto): Promise<AuthResponseDto> {
    return this.authService.signUp(signUpUserDto);
  }
}

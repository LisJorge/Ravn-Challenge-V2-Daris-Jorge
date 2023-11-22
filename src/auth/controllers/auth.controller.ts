import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../services';
import { Request } from 'express';
import { AuthUserDto, SignUpUserDto } from '../dtos';
import { AuthGuard } from '@nestjs/passport';
import { Public } from '../decorators';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService){}
  
  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Req() req:Request){
    const user = req.user as AuthUserDto;
    return this.authService.generateJwt(user); 
  }

  @Post('sing-up')
  signUp(@Body() signUpUserDto: SignUpUserDto){
    return this.authService.signUp(signUpUserDto);
  }
}

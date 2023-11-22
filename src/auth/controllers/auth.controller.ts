import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../services';
import { Request } from 'express';
import { AuthUserDto } from '../dtos';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService){}
  
  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Req() req:Request){
    const user = req.user as AuthUserDto;
    return this.authService.generateJwt(user); 
  }
}

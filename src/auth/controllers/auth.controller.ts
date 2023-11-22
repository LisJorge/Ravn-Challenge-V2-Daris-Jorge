import { Controller, Post, Req } from '@nestjs/common';
import { AuthService } from '../services';
import { Request } from 'express';
import { AuthUserDto } from '../dtos';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService){}
  
  @Post()
  login(@Req() req:Request){
    const user = req.user as AuthUserDto;
    return this.authService.generateJwt(user); 
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { UsersService } from 'src/users/services';
import { AuthUserDto, TokenPayloadDto } from '../dtos';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(username);
    if(user) return user;
    return null;
  }

  generateJwt(user: AuthUserDto){
    const { role, userId: sub} = user;
    const payload: TokenPayloadDto = {
      role,
      sub 
    };
    return {
      access_token: this.jwtService.sign(payload)
    };
  }
}

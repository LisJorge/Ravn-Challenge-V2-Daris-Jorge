import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/services';
import { AuthUserDto, TokenPayloadDto } from '../dtos';
import { JwtService } from '@nestjs/jwt';
import { checkPassword } from '../utils';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(username);
    const {password: dbPassword, ...userData} = user;
    if(user){
      const passwordMatch = await checkPassword(dbPassword, password);
      if(passwordMatch){
        return userData;
      } else {
        return null;
      }
    }
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

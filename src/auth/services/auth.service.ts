import { Injectable } from '@nestjs/common';
import {
  AuthResponseDto,
  AuthUserDto,
  SignUpUserDto,
  TokenPayloadDto,
} from '../dtos';
import { JwtService } from '@nestjs/jwt';
import { checkPassword, encodePassword } from '../utils';
import { Role } from '@prisma/client';
import { UsersService } from '@/users/services';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async encodePassword(password: string): Promise<string> {
    return encodePassword(password);
  }

  async checkPassword(dbPassword: string, password: string): Promise<boolean> {
    return checkPassword(dbPassword, password);
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(username);
    const { password: dbPassword, ...userData } = user;
    const passwordMatch = await this.checkPassword(dbPassword, password);
    if (passwordMatch) {
      return userData;
    } else {
      return null;
    }
    return null;
  }

  generateJwt(user: AuthUserDto) {
    const { role, userId: sub } = user;
    const payload: TokenPayloadDto = {
      role,
      sub,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(signUpUseDto: SignUpUserDto): Promise<AuthResponseDto> {
    const { password, ...userData } = signUpUseDto;
    const hashedPassword = await this.encodePassword(password);
    const defaultRole = Role.CLIENT;

    const userCreated = await this.usersService.create({
      ...userData,
      password: hashedPassword,
      role: defaultRole,
    });

    const tokenPayload: TokenPayloadDto = {
      role: defaultRole,
      sub: userCreated.userId,
    };

    const token = {
      access_token: this.jwtService.sign(tokenPayload),
    };

    return token;
  }
}

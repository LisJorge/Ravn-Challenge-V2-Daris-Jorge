import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
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
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async encodePassword(password: string): Promise<string> {
    return encodePassword(password);
  }

  async checkPassword(dbPassword: string, password: string): Promise<boolean> {
    return checkPassword(dbPassword, password);
  }

  async getTokens(tokenPayload: TokenPayloadDto) {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        tokenPayload
      ),
      this.jwtService.signAsync(
        tokenPayload,
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      access_token,
      refresh_token,
    };
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

  async generateJwt(user: AuthUserDto): Promise<AuthResponseDto> {
    const { role, userId: sub } = user;
    const payload: TokenPayloadDto = {
      role,
      sub,
    };
    const tokens = await this.getTokens(payload);
    await this.usersService.saveRefreshToken(sub, tokens.refresh_token);
    return tokens;
  }

  async signUp(signUpUseDto: SignUpUserDto): Promise<AuthResponseDto> {
    const { password, email, ...userData } = signUpUseDto;
    const hashedPassword = await this.encodePassword(password);
    const defaultRole = Role.CLIENT;

    const userExists = await this.usersService.findOneByEmail(email);

    if(userExists){
      throw new BadRequestException('User already exists');
    }

    const userCreated = await this.usersService.create({
      ...userData,
      password: hashedPassword,
      role: defaultRole,
      email
    });

    const tokenPayload: TokenPayloadDto = {
      role: defaultRole,
      sub: userCreated.userId,
    };

    const tokens = await this.getTokens(tokenPayload);

    await this.usersService.saveRefreshToken(userCreated.userId, tokens.refresh_token);

    return tokens
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const { refreshToken: refreshTokenFromDb, role } = await this.usersService.findOneById(userId);
    if (!refreshTokenFromDb){
      throw new ForbiddenException('Access Denied');
    }
    const refreshTokenMatches = refreshToken === refreshTokenFromDb;
    if (!refreshTokenMatches){ 
      throw new ForbiddenException('Access Denied')
    };
    const tokens = await this.getTokens({
      sub: userId, 
      role
    });
    await this.usersService.saveRefreshToken(userId, tokens.refresh_token)
    return tokens;
  }

  async signOut(userId: number){
    await this.usersService.removeRefreshToken(userId);
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findOneByEmail(email);
  }

  async resetPassword(token: string){}
}

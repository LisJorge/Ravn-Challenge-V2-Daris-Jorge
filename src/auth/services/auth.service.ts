import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { MailService } from '@/mail/services/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  async encodePassword(password: string): Promise<string> {
    return encodePassword(password);
  }

  async checkPassword(dbPassword: string, password: string): Promise<boolean> {
    return checkPassword(dbPassword, password);
  }

  async getTokens(tokenPayload: TokenPayloadDto) {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(tokenPayload),
      this.jwtService.signAsync(tokenPayload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  async getForgotPasswordToken(email: string): Promise<string> {
    return this.jwtService.signAsync(
      { email },
      {
        secret: this.configService.get<string>('JWT_FORGOT_PASSWORD_SECRET'),
        expiresIn: '20m',
      },
    );
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(username);
    if (user) {
      const { password: dbPassword, ...userData } = user;
      const passwordMatch = await this.checkPassword(dbPassword, password);
      if (passwordMatch) {
        return userData;
      } else {
        return null;
      }
    }
    return null;
  }

  async login(user: AuthUserDto): Promise<AuthResponseDto> {
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

    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const userCreated = await this.usersService.create({
      ...userData,
      password: hashedPassword,
      role: defaultRole,
      email,
    });

    const tokenPayload: TokenPayloadDto = {
      role: defaultRole,
      sub: userCreated.userId,
    };

    const tokens = await this.getTokens(tokenPayload);

    await this.usersService.saveRefreshToken(
      userCreated.userId,
      tokens.refresh_token,
    );

    return tokens;
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const { refreshToken: refreshTokenFromDb, role } =
      await this.usersService.findOneById(userId);
    if (!refreshTokenFromDb) {
      throw new ForbiddenException('Access Denied');
    }
    const refreshTokenMatches = refreshToken === refreshTokenFromDb;
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }
    const tokens = await this.getTokens({
      sub: userId,
      role,
    });
    await this.usersService.saveRefreshToken(userId, tokens.refresh_token);
    return tokens;
  }

  async signOut(userId: number) {
    await this.usersService.removeRefreshToken(userId);
  }

  async forgotPassword(email: string): Promise<string> {
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      const { userId } = user;
      const token = await this.getForgotPasswordToken(email);
      await this.usersService.savePasswordToken(userId, token);
      return token;
    }
    throw new NotFoundException('User does not exist');
  }

  async resetPassword(token: string, newPassword: string) {
    const tokenDecoded = await this.jwtService.decode(token);
    const email = tokenDecoded?.email;
    const hashedPassword = await this.encodePassword(newPassword);
    const user = await this.usersService.findOneByEmail(email);
    const tokenIsValid = token === user.passwordToken;
    if (user && tokenIsValid) {
      const { userId } = user;
      await Promise.all([
        this.usersService.removePasswordToken(userId, hashedPassword),
        this.mailService.sendPasswordResetConfirmation(user),
      ]);
    } else {
      throw new BadRequestException('Invalid information');
    }
  }
}

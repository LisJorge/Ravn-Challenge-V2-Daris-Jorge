import { Module } from '@nestjs/common';
import { AuthService } from './services';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './controllers/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy, LocalStrategy } from './strategies';
import { MailModule } from '@/mail/mail.module';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PassportModule,
    MailModule,
    UsersModule,
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: '10s',
          },
        };
      },
    }),
    ConfigModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}

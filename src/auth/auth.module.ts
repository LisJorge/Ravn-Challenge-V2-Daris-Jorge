import { Module } from '@nestjs/common';
import { AuthService } from './services';
import { AuthController } from './controllers';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy, LocalStrategy, RefreshTokenStrategy } from './strategies';
import { MailModule } from '@/mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '@/users/users.module';

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
            expiresIn: '12h',
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

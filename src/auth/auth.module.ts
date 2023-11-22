import { Module } from '@nestjs/common';
import { AuthService } from './services';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './controllers/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy, LocalStrategy } from './strategies';

@Module({
  imports: [
    PassportModule, 
    UsersModule,
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: '',
          signOptions: {
            expiresIn: '10d',
          }
        }
      }
    })
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}

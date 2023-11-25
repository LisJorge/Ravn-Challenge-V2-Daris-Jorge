import { Test, TestingModule } from '@nestjs/testing';
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
  createParamDecorator,
} from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '@/prisma/services';
import { JwtAuthGuard, RolesGuard } from '@/auth/guards';
import { CurrentUser } from '@/common/decorators';
import { AuthModule } from '@/auth/auth.module';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '@/users/services';
import { JwtService } from '@nestjs/jwt';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  const mockUserSevice = {    
      findOneByEmail: jest.fn().mockResolvedValue({ stock: 10 }),
      savePasswordToken: jest.fn(),
      removeRefreshToken: jest.fn(),
      saveRefreshToken: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    decode: jest.fn(() => ({email: 'email'})),
  }

  const mockAuthGuard = {
    canActivate: (context: ExecutionContext) => {
      const req = context.switchToHttp().getRequest();

      req.user = req.body;
      return true;
    },
  };

  const mockJwtGuard = {
    canActivate: (context: ExecutionContext) => {
      const req = context.switchToHttp().getRequest();

      req.user = req.body;
      return true;
    },
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(JwtService)
      .useValue(mockJwtService)
      .overrideProvider(UsersService)
      .useValue(mockUserSevice)
      .overrideGuard(AuthGuard('local'))
      .useValue(mockAuthGuard)
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
  });

  it('/login (POST)', () => {
    return request(app.getHttpServer()).post('/auth/login').expect(201);
  });

  it('/sign-out(POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/sign-out')
      .expect(201);
  });

  it('/reset-password (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/reset-password')
      .send({
        password: 'pass',
        token: 'token'
      })
      .expect(400);
  });
});

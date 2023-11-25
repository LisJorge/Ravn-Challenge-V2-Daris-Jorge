import { Test, TestingModule } from '@nestjs/testing';
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
  createParamDecorator,
} from '@nestjs/common';
import * as request from 'supertest';
import { CartsModule } from '@/carts/carts.module';
import { PrismaService } from '@/prisma/services';
import { JwtAuthGuard, RolesGuard } from '@/auth/guards';
import { CurrentUser } from '@/common/decorators';

describe('CartsController (e2e)', () => {
  let app: INestApplication;

  const mockPrisma = {
    cartDetail: {
      findOne: jest.fn().mockResolvedValue({ stock: 10 }),
      create: jest.fn(),
      findMany: jest.fn().mockResolvedValue({}),
    },
  };

  const mockJwtGuard = {
    canActivate: (context: ExecutionContext) => {
      const req = context.switchToHttp().getRequest();

      req.user = req.body;
      return true;
    },
  };

  const mockRolesGuard = {
    canActivate: (context: ExecutionContext) => {
      const req = context.switchToHttp().getRequest();

      req.user = req.body;
      return true;
    },
  };

  const mockUserDecorator = createParamDecorator(
    (data: any, context: ExecutionContext) => {
      const request = context.switchToHttp().getRequest();
      const user = {
        sub:1,
      }
      return data? user[data]: user;
    },
  );

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CartsModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .overrideProvider(CurrentUser)
      .useValue(mockUserDecorator)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
  });

  it('/carts (GET)', () => {
    return request(app.getHttpServer()).get('/carts').expect(200).expect({});
  });
});

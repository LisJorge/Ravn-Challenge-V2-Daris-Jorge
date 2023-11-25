import { Test, TestingModule } from '@nestjs/testing';
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '@/prisma/services';
import { JwtAuthGuard, RolesGuard } from '@/auth/guards';
import { ProductsModule } from '@/products/products.module';
import { CreateProductDto } from '@/products/dtos';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;

  const mockPrisma = {
    product: {
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

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ProductsModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)

      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
  });

  it('/product (POST)', () => {
    const productDto : CreateProductDto= {
      name: 'name',
      imageUrl: 'url',
      isActive: true,
      price: 10,
    }
    return request(app.getHttpServer()).post('/products').send(productDto).expect(201).expect({});
  });
});

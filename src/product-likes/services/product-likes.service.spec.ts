import { Test, TestingModule } from '@nestjs/testing';
import { ProductLikesService } from './product-likes.service';
import { PrismaService } from '@/prisma/services';

describe('ProductLikesService', () => {
  let service: ProductLikesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductLikesService, PrismaService],
    }).compile();

    service = module.get<ProductLikesService>(ProductLikesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

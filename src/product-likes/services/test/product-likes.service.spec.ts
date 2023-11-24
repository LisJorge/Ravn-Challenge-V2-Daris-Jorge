import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/prisma/services';
import { ProductLikesService } from '../product-likes.service';
import { ProductsService } from '@/products/services';

describe('ProductLikesService', () => {
  let service: ProductLikesService;
  const mockPrisma = {
    productLike: {
      create: jest.fn(),
      findFirstOrThrow: jest.fn(),
      findFirst: jest.fn(),
      delete: jest.fn()
    }
  }

  const mockProductService = {
    findOne: jest.fn()
  }

  const productLikeDto = {
    productId: 1,
  }

  const mockProductLike = {
    productId:1,
    userId: 1,
  }

  const userId = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductLikesService,
        {
          provide: PrismaService,
          useValue: mockPrisma
        },
        {
          provide: ProductsService,
          useValue: mockProductService,
        }
      ],
    })
    .compile();

    service = module.get<ProductLikesService>(ProductLikesService);
  });

  describe('create', () => {
    it('should call prisma create method', async () => {
      await service.create(productLikeDto, userId);
      expect(mockPrisma.productLike.create).toHaveBeenCalled();
    });
  })

  describe('findOne', () => {
    it('should call prisma findOne method', async () => {
      mockPrisma.productLike.findFirst.mockImplementationOnce(() => mockProductLike)
      await service.findOne(productLikeDto);
      expect(mockPrisma.productLike.findFirst).toHaveBeenCalled();
    });
  
    it('should throw an exception', async () => {
      mockPrisma.productLike.findFirst.mockImplementationOnce(() => {null})
      try {
        await service.findOne(productLikeDto); 
      } catch (e) {
        expect(e.message).toEqual('Like not found') 
      }
    });
  });

  describe('remove', () => {
    it('should call prisma create method', async () => {
      mockPrisma.productLike.findFirst.mockImplementationOnce(() => mockProductLike)
      await service.remove(productLikeDto, userId);
      expect(mockPrisma.productLike.delete).toHaveBeenCalled();
    });
  });

});

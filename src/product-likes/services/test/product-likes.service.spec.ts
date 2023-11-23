import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/prisma/services';
import { ProductLikesService } from '../product-likes.service';
import { NotFoundException } from '@nestjs/common';

describe('ProductLikesService', () => {
  let service: ProductLikesService;
  const mockPrisma = {
    productLike: {
      create: jest.fn(),
      findFirstOrThrow: jest.fn(),
      delete: jest.fn()
    }
  }

  const productLikeDto = {
    userId: 1,
    productId: 1,
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductLikesService, PrismaService],
    })
    .overrideProvider(PrismaService)
    .useValue(mockPrisma)
    .compile();

    service = module.get<ProductLikesService>(ProductLikesService);
  });

  describe('create', () => {
    it('should call prisma create method', async () => {
      await service.create(productLikeDto);
      expect(mockPrisma.productLike.create).toHaveBeenCalled();
    });
  })

  describe('findOne', () => {
    it('should call prisma create method', async () => {
      await service.findOne(productLikeDto);
      expect(mockPrisma.productLike.findFirstOrThrow).toHaveBeenCalled();
    });
  
    it('should throw an exception', async () => {
      mockPrisma.productLike.findFirstOrThrow.mockImplementationOnce(() => {throw new Error('')})
      try {
        await service.findOne(productLikeDto); 
      } catch (e) {
        expect(e.message).toEqual('Like not found') 
      }
    });
  });

  describe('remove', () => {
    it('should call prisma create method', async () => {
      await service.remove(productLikeDto);
      expect(mockPrisma.productLike.delete).toHaveBeenCalled();
    });
  });

});

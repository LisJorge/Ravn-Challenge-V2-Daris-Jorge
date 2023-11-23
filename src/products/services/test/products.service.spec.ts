import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../products.service';
import { CreateProductDto } from '@/products/dtos';
import { PrismaService } from '@/prisma/services';

describe('ProductsService', () => {
  let service: ProductsService;
  const mockPrisma = {
    product: {
      create: jest.fn(),
      findFirstOrThrow: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const productDto: CreateProductDto = {
    name: 'name',
    imageUrl: 'url',
    price: 10,
    isActive: true,
  };

  const productId = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    service = module.get<ProductsService>(ProductsService);
  });

  describe('create', () => {
    it('should call prisma create method', async () => {
      await service.create(productDto);
      expect(mockPrisma.product.create).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call prisma create method', async () => {
      await service.findOne(productId);
      expect(mockPrisma.product.findFirstOrThrow).toHaveBeenCalled();
    });

    it('should throw an exception', async () => {
      mockPrisma.product.findFirstOrThrow.mockImplementationOnce(() => {throw new Error('')})
      try {
        await service.findOne(productId); 
      } catch (e) {
        expect(e.message).toEqual('Product not found') 
      }
    });
  });

  describe('updateProductAvailable', () => {
    it('should call prisma create method', async () => {
      mockPrisma.product.findFirstOrThrow.mockImplementationOnce(() => ({isActive: true}))
      await service.updateProductAvailable(productId);
      expect(mockPrisma.product.update).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should call prisma create method', async () => {
      await service.update(productId, productDto);
      expect(mockPrisma.product.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should call prisma create method', async () => {
      await service.remove(productId);
      expect(mockPrisma.product.delete).toHaveBeenCalled();
    });
  });
});

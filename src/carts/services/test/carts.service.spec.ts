import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/prisma/services';
import { CartsService } from '../carts.service';
import { CartDetail } from '@prisma/client';
import { ProductsService } from '@/products/services';

describe('CartsService', () => {
  let service: CartsService;
  const mockPrisma = {
    cartDetail: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }
  }
  const mockProductService = {
    findOne: jest.fn(() => ({stock: 100}))
  }
  
  const mockCart: CartDetail = {
    productId: 1,
    userId: 1,
    quantity: 1,
  }
  
  const userId = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartsService, 
        {
          provide: PrismaService,
          useValue: mockPrisma
        },
        {
          provide: ProductsService,
          useValue: mockProductService,
        }
      ],
    }).compile();
    service = module.get<CartsService>(CartsService);
  });

  describe('create', () => {
    it('should call prisma create method', async () => {
      await service.create(mockCart, userId);
      expect(mockPrisma.cartDetail.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should call prisma findMany method', async () => {
      await service.findAll(mockCart.userId);
      expect(mockPrisma.cartDetail.findMany).toHaveBeenCalled();
    });
  })

  describe('update', () => {
    it('should call prisma update method', async () => {
      const {productId, userId, ...cartData} = mockCart;
      await service.update(productId, userId, cartData);
      expect(mockPrisma.cartDetail.update).toHaveBeenCalled();
    });
  })
  
  describe('remove', () => {
    it('should call prisma delete method', async () => {
      const {productId, userId} = mockCart;
      await service.remove(productId, userId);
      expect(mockPrisma.cartDetail.delete).toHaveBeenCalled();
    });
  })
});

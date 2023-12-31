import { Test, TestingModule } from '@nestjs/testing';
import { ProductLikesController } from '../product-likes.controller';
import { ProductLikesService } from '@/product-likes/services';

describe('ProductLikesController', () => {
  let controller: ProductLikesController;
  const mockService = {
    create: jest.fn(),
    remove: jest.fn(),
  };

  const productLikeDto = {
    productId: 1,
  };

  const userId = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductLikesController,
        {
          provide: ProductLikesService,
          useValue: mockService,
        }
      ],
    }).compile();

    controller = module.get<ProductLikesController>(ProductLikesController);
  });

  describe('create', () => {
    it('should call prisma create method', async () => {
      await controller.create(productLikeDto, userId);
      expect(mockService.create).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should call prisma create method', async () => {
      await controller.remove(productLikeDto, userId);
      expect(mockService.remove).toHaveBeenCalled();
    });
  });
});

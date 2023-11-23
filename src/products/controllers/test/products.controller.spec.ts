import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from '@/products/controllers';
import { CreateProductDto } from '@/products/dtos';
import { ProductsService } from '@/products/services';

describe('ProductsController', () => {
  let controller: ProductsController;
  const mockService = {
    create: jest.fn(),
    findFirstOrThrow: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const createProductDto: CreateProductDto = {
    name: 'name',
    imageUrl: 'url',
    price: 10,
    isActive: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsController, ProductsService],
    })
      .overrideProvider(ProductsService)
      .useValue(mockService)
      .compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  describe('create', () => {
    it('should call create method', async () => {
      await controller.create(createProductDto);
      expect(mockService.create).toHaveBeenCalled();
    });
  });
});

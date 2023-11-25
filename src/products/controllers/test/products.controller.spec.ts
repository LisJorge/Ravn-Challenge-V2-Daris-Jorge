import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from '@/products/controllers';
import { CreateProductDto } from '@/products/dtos';
import { ProductsService } from '@/products/services';

describe('ProductsController', () => {
  let controller: ProductsController;
  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    updateProductAvailable: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const createProductDto: CreateProductDto = {
    name: 'name',
    imageUrl: 'url',
    price: 10,
    isActive: true,
  };

  const productId = 1;

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

  describe('findAll', () => {
    it('should call findAll method', async () => {
      await controller.findAll({});
      expect(mockService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call findOne method', async () => {
      await controller.findOne(productId);
      expect(mockService.create).toHaveBeenCalled();
    });
  });

  describe('updateAvailability', () => {
    it('should call updateAvailability method', async () => {
      await controller.updateAvailability(productId);
      expect(mockService.updateProductAvailable).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should call update method', async () => {
      await controller.update(productId, createProductDto);
      expect(mockService.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should call remove method', async () => {
      await controller.remove(productId);
      expect(mockService.remove).toHaveBeenCalled();
    });
  });
});


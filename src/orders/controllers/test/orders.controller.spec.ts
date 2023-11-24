import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from '../orders.controller';
import { OrdersService } from '../../services';
import { CreateOrderDto } from '../../dtos';

describe('OrdersController', () => {
  let controller: OrdersController;
  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
  };

  const createOrderDto: CreateOrderDto= {
    orderDetails: [
      {
        productId: 1,
        quantity: 10,
        price: 10,
      },
      {
        productId: 2,
        quantity: 2,
        price: 5,
      }
    ]
  };
  const userId=1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [OrdersService]
    })
    .overrideProvider(OrdersService)
    .useValue(mockService)
    .compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  describe('create', () => {
    it('should call create method', async () => {
      await controller.create(createOrderDto, userId);
      expect(mockService.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should call findAll method', async () => {
      await controller.findAll();
      expect(mockService.findAll).toHaveBeenCalled();
    });
  });
});

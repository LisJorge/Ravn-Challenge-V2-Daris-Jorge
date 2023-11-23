import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '@/prisma/services';
import { CreateOrderDto } from '../dtos';

describe('OrdersService', () => {
  let service: OrdersService;
  const mockPrisma = {
    order: {
      create: jest.fn(),
      findMany: jest.fn(),
    }
  }

  const createOrderDto: CreateOrderDto= {
    userId: 1,
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
  const total = 110;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        }
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  describe('create', () => {
    it('should return a new order', async () => {
      mockPrisma.order.create.mockImplementation((orderData) => (orderData.data))
      const request = await service.create(createOrderDto);
      expect(request.total).toBe(total)
      expect(mockPrisma.order.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return orders array', async () => {
      mockPrisma.order.findMany.mockImplementation(() => ([createOrderDto]));
      const request = await service.findAll({});
      expect(mockPrisma.order.findMany).toHaveBeenCalled();
    });
  });
});

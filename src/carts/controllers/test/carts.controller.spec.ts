import { CartsService } from "@/carts/services";
import { Test } from "@nestjs/testing";
import { CartDetail } from "@prisma/client";
import { CartsController } from "../carts.controller";
import { PrismaService } from "@/prisma/services";

describe('CartsController', () => {
  let cartsController: CartsController;
  const mockCartsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  }

  const mockCart: CartDetail = {
    productId: 1,
    userId: 1,
    quantity: 1,
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
        controllers: [CartsController],
        providers: [CartsService, PrismaService],
      }).overrideProvider(CartsService).useValue(mockCartsService).compile();

    cartsController = moduleRef.get<CartsController>(CartsController);
  });

  describe('findAll', () => {
    it('should return an array of carts', async () => {
      const result = [mockCart];
      mockCartsService.findAll.mockImplementation(() => result)
      const request = await cartsController.findAll(mockCart.userId);
      expect(request).toEqual(result);
    });
  });

  describe('create', () => {
    it('should return a cart', async () => {
      mockCartsService.create.mockImplementation(() => mockCart);
      const request = await cartsController.create(mockCart);
      expect(request).toEqual(mockCart);
    });
  });

  describe('update', () => {
    it('should call update method from service', async () => {
      const {productId, userId, ...cartData} = mockCart;
      await cartsController.update(productId, cartData, userId );
      expect(mockCartsService.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should call remove method from service', async () => {
      const {productId, userId } = mockCart;
      await cartsController.remove(productId, userId );
      expect(mockCartsService.remove).toHaveBeenCalled();
    });
  });
});
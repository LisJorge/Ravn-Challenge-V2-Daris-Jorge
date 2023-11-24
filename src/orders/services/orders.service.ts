import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDetailDto, CreateOrderDto, GetAllOrdersDto } from '../dtos';
import { Order } from '@prisma/client';
import { getTotalFromOrderDetails } from '../utils';
import { PrismaService } from '@/prisma/services';
import { ProductsService } from '@/products/services';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService,
  ) {}

  async validateProductStock(orderDetail: CreateOrderDetailDto){
    const {stock} = await this.productsService.findOne(orderDetail.productId);
    if(stock < orderDetail.quantity){
      throw new BadRequestException('Not enough products in stock');
    }
  }

  async create(createOrderDto: CreateOrderDto, userId: number): Promise<Order> {
    const { orderDetails, ...orderData} = createOrderDto;
    await Promise.all(orderDetails.map((orderDetail) => (this.validateProductStock(orderDetail))));
    const total = getTotalFromOrderDetails(orderDetails);
    const order = await this.prisma.order.create({
      data: {
        total,
        ...orderData,
        userId,
        orderDetails: {
          createMany: {
            data: orderDetails
          }
        }
      },
      include: {orderDetails: true}
    });
    return order;
  }

  async findAll(filter: GetAllOrdersDto): Promise<Order[]> {
    const userId = filter.userId;
    return this.prisma.order.findMany({
      where: userId ? {userId: userId} : {},
    });
  }
}

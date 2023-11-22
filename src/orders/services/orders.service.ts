import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/services';
import { CreateOrderDto, GetAllOrdersDto, UpdateOrderDto } from '../dtos';
import { Order } from '@prisma/client';
import { getTotalFromOrderDetails } from '../utils';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { orderDetails, ...orderData} = createOrderDto;
    const total = getTotalFromOrderDetails(orderDetails);
    const order = await this.prisma.order.create({
      data: {
        total,
        ...orderData,
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

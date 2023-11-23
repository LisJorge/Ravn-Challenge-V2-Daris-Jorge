import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto, GetAllOrdersDto } from '../dtos';
import { Order } from '@prisma/client';
import { getTotalFromOrderDetails } from '../utils';
import { PrismaService } from '@/prisma/services';

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

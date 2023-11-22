import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { OrdersService } from '../services';
import { CreateOrderDto, GetAllOrdersDto, UpdateOrderDto } from '../dtos';
import { Order } from '@prisma/client';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  async findAll(@Query() filter: GetAllOrdersDto): Promise<Order[]> {
    return this.ordersService.findAll(filter);
  }
}

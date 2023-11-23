import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from '../services';
import { CreateOrderDto, GetAllOrdersDto} from '../dtos';
import { Order, Role } from '@prisma/client';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CREATED_RESPONSE, FORBIDDEN_RESPONSE, GENERAL_RESPONSE, UNAUTHORIZED_RESPONSE } from '@common/api-responses';
import { JwtAuthGuard, RolesGuard } from '@/auth/guards';
import { Roles } from '@/auth/decorators';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @Roles(Role.MANAGER)
  @ApiResponse(CREATED_RESPONSE)
  @ApiResponse(UNAUTHORIZED_RESPONSE)
  @ApiResponse(FORBIDDEN_RESPONSE)
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @ApiResponse(GENERAL_RESPONSE)
  async findAll(@Query() filter: GetAllOrdersDto): Promise<Order[]> {
    return this.ordersService.findAll(filter);
  }
}

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
import { CurrentUser } from '@/common/decorators';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.CLIENT)
@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiResponse(CREATED_RESPONSE)
  @ApiResponse(UNAUTHORIZED_RESPONSE)
  @ApiResponse(FORBIDDEN_RESPONSE)
  async create(@Body() createOrderDto: CreateOrderDto, @CurrentUser('sub') userId: number): Promise<Order> {
    return this.ordersService.create(createOrderDto, userId);
  }

  @Get()
  @ApiResponse(GENERAL_RESPONSE)
  async findAllByUserId(@CurrentUser('sub') userId: number): Promise<Order[]> {
    return this.ordersService.findAll({userId});
  }

  @Get('show-all-orders')
  @Roles(Role.MANAGER)
  @ApiResponse(GENERAL_RESPONSE)
  async findAll(@Query('userId') userId?: number): Promise<Order[]> {
    return this.ordersService.findAll({userId});
  }
}

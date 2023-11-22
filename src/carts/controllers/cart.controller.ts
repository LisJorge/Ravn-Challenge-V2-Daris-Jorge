import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Query,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { CreateCartDto, UpdateCartDto } from '../dtos';
import { CartDetail } from '@prisma/client';
import { PaginationDto } from 'src/common/dto';
import { CartsService } from '../services';

@Controller('products')
export class ProductsController {
  constructor(private readonly cartsService: CartsService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createCartDto: CreateCartDto): Promise<CartDetail> {
    return this.cartsService.create(createCartDto);
  }

  @Get()
  async findtAll(
    @Query() pagination: PaginationDto,
    userId: number,
  ): Promise<CartDetail[]> {
    return this.cartsService.findAll(pagination, userId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':productId')
  async update(
    @Param('productId') productId: number,
    @Body() UpdateCartDto: UpdateCartDto,
    userId: number,
  ) {
    return await this.cartsService.update(productId, userId, UpdateCartDto);
  }

  @Delete(':productId')
  async remove(@Param('productId') productId: number, userId: number) {
    return await this.cartsService.remove(productId, userId);
  }
}

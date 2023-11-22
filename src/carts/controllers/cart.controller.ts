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
  UseGuards,
} from '@nestjs/common';
import { CreateCartDto, UpdateCartDto } from '../dtos';
import { CartDetail, Role } from '@prisma/client';
import { PaginationDto } from 'src/common/dto';
import { CartsService } from '../services';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import { Roles } from 'src/auth/decorators';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CREATED_RESPONSE,
  FORBIDDEN_RESPONSE,
  GENERAL_RESPONSE,
  UNAUTHORIZED_RESPONSE,
  UPDATE_RESPONSE,
} from 'src/common/api-responses';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Carts')
@Roles(Role.CLIENT)
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiResponse(CREATED_RESPONSE)
  @ApiResponse(UNAUTHORIZED_RESPONSE)
  @ApiResponse(FORBIDDEN_RESPONSE)
  async create(@Body() createCartDto: CreateCartDto): Promise<CartDetail> {
    return this.cartsService.create(createCartDto);
  }

  @Get()
  @ApiResponse(GENERAL_RESPONSE)
  async findAll(
    @Query() pagination: PaginationDto,
    userId: number,
  ): Promise<CartDetail[]> {
    return this.cartsService.findAll(pagination, userId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':productId')
  @ApiResponse(UPDATE_RESPONSE)
  async update(
    @Param('productId') productId: number,
    @Body() UpdateCartDto: UpdateCartDto,
    userId: number,
  ) {
    return await this.cartsService.update(productId, userId, UpdateCartDto);
  }

  @ApiResponse(GENERAL_RESPONSE)
  @Delete(':productId')
  async remove(@Param('productId') productId: number, userId: number) {
    return await this.cartsService.remove(productId, userId);
  }
}

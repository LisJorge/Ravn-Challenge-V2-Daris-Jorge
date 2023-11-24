import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProductLikesService } from '../services';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductLike, Role } from '@prisma/client';
import { ProductLikeDto } from '../dtos';
import { JwtAuthGuard, RolesGuard } from '@/auth/guards';
import { Roles } from '@/auth/decorators';
import {
  CREATED_RESPONSE,
  FORBIDDEN_RESPONSE,
  GENERAL_RESPONSE,
  UNAUTHORIZED_RESPONSE,
} from '@/common/api-responses';
import { CurrentUser } from '@/common/decorators';

@ApiTags('Product-Likes')
@Roles(Role.CLIENT)
@UseGuards(JwtAuthGuard,RolesGuard)
@Controller('product-likes')
export class ProductLikesController {
  constructor(private readonly productLikesService: ProductLikesService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiResponse(CREATED_RESPONSE)
  @ApiResponse(UNAUTHORIZED_RESPONSE)
  @ApiResponse(FORBIDDEN_RESPONSE)
  async create(@Body() productLikeDto: ProductLikeDto, @CurrentUser('sub') userId: number): Promise<ProductLike> {
    return this.productLikesService.create(productLikeDto, userId);
  }

  @Delete()
  @ApiResponse(GENERAL_RESPONSE)
  @ApiResponse(UNAUTHORIZED_RESPONSE)
  @ApiResponse(FORBIDDEN_RESPONSE)
  async remove(@Body() productLikeDto: ProductLikeDto, @CurrentUser('sub') userId: number) {
    return this.productLikesService.remove(productLikeDto, userId);
  }
}

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
import { Roles } from 'src/auth/decorators';
import { ProductLike, Role } from '@prisma/client';
import { RolesGuard } from 'src/auth/guards';
import { ProductLikeDto } from '../dtos';
import { CREATED_RESPONSE, FORBIDDEN_RESPONSE, GENERAL_RESPONSE, UNAUTHORIZED_RESPONSE } from 'src/common/api-responses';

@ApiTags('Product-Likes')
@Roles(Role.CLIENT)
@UseGuards(RolesGuard)
@Controller('product-likes')
export class ProductLikesController {
  constructor(private readonly productLikesService: ProductLikesService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiResponse(CREATED_RESPONSE)
  @ApiResponse(UNAUTHORIZED_RESPONSE)
  @ApiResponse(FORBIDDEN_RESPONSE)
  async create(@Body() productLikeDto: ProductLikeDto): Promise<ProductLike> {
    return this.productLikesService.create(productLikeDto);
  }

  @Delete()
  @ApiResponse(GENERAL_RESPONSE)
  @ApiResponse(UNAUTHORIZED_RESPONSE)
  @ApiResponse(FORBIDDEN_RESPONSE)
  async remove(@Body() productLikeDto: ProductLikeDto) {
    return this.productLikesService.remove(productLikeDto);
  }
}

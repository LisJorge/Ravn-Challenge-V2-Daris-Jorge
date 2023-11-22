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
import { ProductsService } from '../services/products.service';
import {
  CreateProductDto,
  GetAllProductsDto,
  ProductDto,
  UpdateProductDto,
} from '../dtos';
import { Product, Role } from '@prisma/client';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import { Public, Roles } from 'src/auth/decorators';
import { ApiPaginatedResponse } from 'src/common/decorators';
import { PaginatedOutputDto } from 'src/common/dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CREATED_RESPONSE,
  FORBIDDEN_RESPONSE,
  GENERAL_RESPONSE,
  UNAUTHORIZED_RESPONSE,
  UPDATE_RESPONSE,
} from 'src/common/api-responses';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @Roles(Role.MANAGER)
  @ApiResponse(CREATED_RESPONSE)
  @ApiResponse(UNAUTHORIZED_RESPONSE)
  @ApiResponse(FORBIDDEN_RESPONSE)
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Public()
  @Get()
  @ApiResponse({ ...GENERAL_RESPONSE, type: ProductDto })
  @ApiPaginatedResponse(ProductDto)
  async findAll(
    @Query() filter: GetAllProductsDto,
  ): Promise<PaginatedOutputDto<ProductDto>> {
    return this.productsService.findAll(filter);
  }

  @Public()
  @Get(':id')
  @ApiResponse(GENERAL_RESPONSE)
  async findOne(@Param('id') id: number) {
    return await this.productsService.findOne(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id')
  @Roles(Role.MANAGER)
  @ApiResponse(UPDATE_RESPONSE)
  @ApiResponse(UNAUTHORIZED_RESPONSE)
  @ApiResponse(FORBIDDEN_RESPONSE)
  async update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Roles(Role.MANAGER)
  @ApiResponse(GENERAL_RESPONSE)
  @ApiResponse(UNAUTHORIZED_RESPONSE)
  @ApiResponse(FORBIDDEN_RESPONSE)
  async remove(@Param('id') id: number) {
    return await this.productsService.remove(id);
  }
}

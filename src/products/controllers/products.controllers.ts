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
import { CreateProductDto, GetAllProductsDto, ProductDto, UpdateProductDto } from '../dtos';
import { Product, Role } from '@prisma/client';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import { Public, Roles } from 'src/auth/decorators';
import { ApiPaginatedResponse } from 'src/common/decorators';
import { PaginatedOutputDto } from 'src/common/dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @Roles(Role.MANAGER)
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Public()
  @Get()
  @ApiPaginatedResponse(ProductDto)
  async findAll(@Query() filter: GetAllProductsDto): Promise<PaginatedOutputDto<ProductDto>> {
    return this.productsService.findAll(filter);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.productsService.findOne(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id')
  @Roles(Role.MANAGER)
  async update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Roles(Role.MANAGER)
  async remove(@Param('id') id: number) {
    return await this.productsService.remove(id);
  }
}

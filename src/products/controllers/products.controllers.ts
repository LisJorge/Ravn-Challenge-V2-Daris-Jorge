import { Body, Controller, HttpCode, HttpStatus, Post, Get, UsePipes, ValidationPipe, Query, Param, Patch, Delete } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { CreateProductDto, GetAllProductsDto, UpdateProductDto } from '../dto';
import { Product } from '@prisma/client';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Get()
  async findtAll(@Query() filter: GetAllProductsDto): Promise<Product[]>{
    return this.productsService.findAll(filter);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.productsService.findOne(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() UpdateProductDto: UpdateProductDto) {
    return await this.productsService.update(id, UpdateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.productsService.remove(id);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';
import { PrismaService } from 'src/prisma/services/prisma.service';
import {
  CreateProductDto,
  GetAllProductsDto,
  ProductDto,
  UpdateProductDto,
} from '../dtos';
import { CategoriesService } from 'src/categories/services';
import { createPaginator } from 'prisma-pagination';
import { PaginatedOutputDto } from 'src/common/dto';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private categoriesService: CategoriesService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { categoryIds, ...productDto } = createProductDto;
    const categories = categoryIds.map((categoryId) => ({categoryId}));
    return await this.prisma.product.create({
      data: {
        ...productDto,
        categories: {
          connect: categories,
        },
      },
      include: {categories: true}
    });
  }

  async findOne(productId: number): Promise<Product> {
    try {
      return this.prisma.product.findFirstOrThrow({
        where: { productId },
        include: { categories: true },
      });
    } catch (e) {
      throw new NotFoundException('Product not found');
    }
  }

  async findAll(
    filter: GetAllProductsDto,
  ): Promise<PaginatedOutputDto<ProductDto>> {
    const { page, perPage, categoryId } = filter;
    const paginate = createPaginator({ perPage });
    const queryFilter = categoryId
      ? {
          categories: {
            some: { categoryId},
          },
        }
      : {};
    return paginate(
      this.prisma.product,
      {
        include: {categories: true},
        where: queryFilter,
      },
      { page },
    );
  }

  async update(
    productId: number,
    updateProductDto: UpdateProductDto,
  ): Promise<void> {
    const { categoryIds, ...productData } = updateProductDto;
    const categories = categoryIds.length? categoryIds.map((categoryId) => ({categoryId})): null;
    await this.findOne(productId);
    await this.prisma.product.update({
      where: { productId },
      data: {
        ...productData,
        categories: {
          connect: categories,
        },
      },
    });
  }

  async updateProductAvailable(productId: number): Promise<void> {
    const productSaved = await this.findOne(productId);
    await this.prisma.product.update({
      where: { productId },
      data: { isActive: !productSaved.isActive },
    });
  }

  async remove(productId: number) {
    await this.findOne(productId);
    const deleteTask = await this.prisma.product.delete({
      where: {
        productId,
      },
    });
    return {
      data: deleteTask,
      message: `Success delete ${productId}`,
    };
  }
}

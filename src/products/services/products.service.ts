import { Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from 'src/prisma/services/prisma.service';
import { CreateProductDto, GetAllProductsDto, UpdateProductDto } from '../dtos';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({ data: createProductDto });
  }

  async findOne(
    productId: number
  ): Promise<Product> {
    return this.prisma.product.findFirstOrThrow({where: {productId}});
  }

  async findAll(filter: GetAllProductsDto): Promise<Product[]> {
    const { skip, take, categoryId } = filter;
    const queryFilter = {
      categories: {
        some: { categoryId },
      },
    };
    return this.prisma.product.findMany({
      skip,
      take,
      where: categoryId? queryFilter : {}
    });
  }

  async update(productId: number, updateProductDto: UpdateProductDto): Promise<void> {
    await this.prisma.product.update({where: {productId}, data: updateProductDto});
  }

  async remove(productId: number) {
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

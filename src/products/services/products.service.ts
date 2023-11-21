import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from 'src/prisma/services/prisma.service';
import { CreateProductDto, GetAllProductsDto, UpdateProductDto } from '../dtos';
import { CategoriesService } from 'src/categories/services';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private categoriesService: CategoriesService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { categoryIds, ...productDto } = createProductDto;
    const categories = await this.categoriesService.findByIds(categoryIds);
    return await this.prisma.product.create({
      data: {
        ...productDto,
        categories: {
          connect: categories,
        },
      },
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
      where: categoryId ? queryFilter : {},
    });
  }

  async update(
    productId: number,
    updateProductDto: UpdateProductDto,
  ): Promise<void> {
    await this.prisma.product.update({
      where: { productId },
      data: updateProductDto,
    });
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

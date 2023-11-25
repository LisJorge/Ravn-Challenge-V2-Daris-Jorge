import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '@prisma/client';
import {
  CreateProductDto,
  GetAllProductsDto,
  ProductDto,
  UpdateProductDto,
} from '../dtos';
import { createPaginator } from 'prisma-pagination';
import { PrismaService } from '@/prisma/services';
import { PaginatedOutputDto } from '@/common/dto';
import { CloudinaryService } from '@/cloudinary/services';
import { formatFileName } from '../utils';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { categoryIds = [], ...productDto } = createProductDto;
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
    const { page, perPage, categoryId, ...filterData } = filter;
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
        where: {
          ...filterData,
          ...queryFilter
        },
      },
      { page },
    );
  }

  async update(
    productId: number,
    updateProductDto: UpdateProductDto,
  ): Promise<void> {
    const { categoryIds, ...productData } = updateProductDto;
    const categories = categoryIds && categoryIds.length? categoryIds.map((categoryId) => ({categoryId})): [];
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

  async uploadImage(file: Express.Multer.File, productId: number){
    const newFilename = formatFileName(file.originalname);
    const fileFormatted = {
      ...file,
      originalname: newFilename,
      use_filename: true,
    }
    await this.prisma.product.update({
      where: { productId },
      data: { imageUrl: newFilename },
    });
    return await this.cloudinaryService.uploadImage(fileFormatted).catch((e) => {
      throw new BadRequestException(e);
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

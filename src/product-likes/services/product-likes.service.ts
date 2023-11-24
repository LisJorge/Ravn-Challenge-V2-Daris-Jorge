import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductLikeDto } from '../dtos';
import { ProductLike } from '@prisma/client';
import { PrismaService } from '@/prisma/services';

@Injectable()
export class ProductLikesService {
  constructor(private prisma: PrismaService) {}

  async create(
    productLikeDto: ProductLikeDto,
    userId: number,
  ): Promise<ProductLike> {
    return this.prisma.productLike.create({
      data: {
        ...productLikeDto,
        userId,
      },
    });
  }

  async findOne(productLikeDto: ProductLikeDto): Promise<ProductLike> {
    const productLike = await this.prisma.productLike.findFirst({
      where: productLikeDto,
    });
    if (!productLike) {
      throw new NotFoundException('Like not found');
    }
    return productLike;
  }
  async remove(productLikeDto: ProductLikeDto, userId: number) {
    await this.findOne(productLikeDto);
    const deleteTask = await this.prisma.productLike.delete({
      where: {
        productId_userId: {
          ...productLikeDto,
          userId,
        },
      },
    });
    return {
      data: deleteTask,
      message: `Success delete like from ${productLikeDto.productId}`,
    };
  }
}

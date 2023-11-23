import { Injectable } from '@nestjs/common';
import { CartDetail } from '@prisma/client';
import { PrismaService } from '@/prisma/services';
import { CreateCartDto, UpdateCartDto } from '../dtos';

@Injectable()
export class CartsService {
  constructor(private prisma: PrismaService) {}

  async create(createCartDto: CreateCartDto): Promise<CartDetail> {
    return this.prisma.cartDetail.create({ data: createCartDto });
  }

  async findAll(userId: number): Promise<CartDetail[]> {
    const queryFilter = {
      userId,
    };
    return this.prisma.cartDetail.findMany({
      where: queryFilter,
    });
  }

  async update(
    productId: number,
    userId: number,
    updateCartDto: UpdateCartDto,
  ): Promise<void> {
    await this.prisma.cartDetail.update({
      where: { productId_userId: { productId, userId } },
      data: updateCartDto,
    });
  }

  async remove(productId: number, userId: number) {
    const deleteTask = await this.prisma.cartDetail.delete({
      where: {
        productId_userId: {
          productId,
          userId,
        },
      },
    });
    return {
      data: deleteTask,
      message: `Success delete ${productId} product from ${userId} cart `,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { CartDetail } from '@prisma/client';
import { PrismaService } from 'src/prisma/services';
import { CreateCartDto, UpdateCartDto } from '../dtos';
import { PaginationDto } from 'src/common/dto';

@Injectable()
export class CartsService {
  constructor(private prisma: PrismaService) {}

  async create(createCartDto: CreateCartDto): Promise<CartDetail> {
    return this.prisma.cartDetail.create({ data: createCartDto });
  }

  async findAll(filter: PaginationDto, userId: number): Promise<CartDetail[]> {
    const { page, perPage } = filter;
    const queryFilter = {
      userId,
    };
    return this.prisma.cartDetail.findMany({
      skip: page - 1,
      take: perPage,
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

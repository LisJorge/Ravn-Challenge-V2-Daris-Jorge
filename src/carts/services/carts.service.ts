import { BadRequestException, Injectable } from '@nestjs/common';
import { CartDetail } from '@prisma/client';
import { PrismaService } from '@/prisma/services';
import { CreateCartDto, UpdateCartDto } from '../dtos';
import { ProductsService } from '@/products/services';

@Injectable()
export class CartsService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService,
  ) {}

  async create(createCartDto: CreateCartDto, userId: number): Promise<CartDetail> {
    const { productId, quantity } = createCartDto;
    const { stock } = await this.productsService.findOne(productId);
    if (stock >= quantity) {
      console.log({
        ...createCartDto,
        userId
      })
      return await this.prisma.cartDetail.create({ data: {
        ...createCartDto,
        userId
      } });
    }
    throw new BadRequestException('Not enough products in stock');
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
    const { quantity } = updateCartDto;
    const { stock } = await this.productsService.findOne(productId);
    if (stock >= quantity) {
      await this.prisma.cartDetail.update({
        where: { productId_userId: { productId, userId } },
        data: updateCartDto,
      });
    } else {
      throw new BadRequestException('Not enough products in stock');
    }
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
      message: `Success delete ${productId} product from ${userId} user cart `,
    };
  }
}

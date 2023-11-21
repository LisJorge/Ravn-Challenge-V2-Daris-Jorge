import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from 'src/prisma/services/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findByIds(categoryIds: number[]): Promise<Category[]> {
    const queryFilter = categoryIds.length
      ? categoryIds.map((categoryId) => ({ categoryId }))
      : [];
    return await this.prisma.category.findMany({
      where: {
        OR: queryFilter,
      },
    });
  }
}

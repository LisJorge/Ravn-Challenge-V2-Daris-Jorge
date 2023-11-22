import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/services';
import { ProductLikeDto } from '../dtos';
import { ProductLike } from '@prisma/client';

@Injectable()
export class ProductLikesService {
  constructor(private prisma: PrismaService){}

  async create(productLikeDto: ProductLikeDto): Promise<ProductLike> {
    return this.prisma.productLike.create({
      data: productLikeDto,
    });
  }
  
  async findOne(productLikeDto: ProductLikeDto): Promise<ProductLike>{
    try{
      return this.prisma.productLike.findFirstOrThrow({
        where: productLikeDto,
      });
    } catch(e){
      throw new NotFoundException('Like not found');
    }
  }
  async remove(productLikeDto: ProductLikeDto) {
    await this.findOne(productLikeDto);
    const deleteTask = await this.prisma.productLike.delete({
      where: {
        productId_userId: {
          ...productLikeDto
        }
      }});
    return {
      data: deleteTask,
      message: `Success delete like from ${productLikeDto.productId}`,
    };
  }

}

import { Module } from '@nestjs/common';
import { ProductLikesService } from './services/product-likes.service';
import { ProductLikesController } from './controllers/product-likes.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ProductLikesService],
  controllers: [ProductLikesController]
})
export class ProductLikesModule {}

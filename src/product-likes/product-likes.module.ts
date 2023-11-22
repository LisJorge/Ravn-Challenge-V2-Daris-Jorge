import { Module } from '@nestjs/common';
import { ProductLikesService } from './services/product-likes.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductLikesController } from './controllers/product-likes.controller';

@Module({
  imports: [PrismaModule],
  providers: [ProductLikesService],
  controllers: [ProductLikesController]
})
export class ProductLikesModule {}

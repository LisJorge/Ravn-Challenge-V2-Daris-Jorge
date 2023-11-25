import { Module } from '@nestjs/common';
import { ProductsController } from './controllers';
import { ProductsService } from './services';
import { PrismaModule } from '@/prisma/prisma.module';
import { CloudinaryModule } from '@/cloudinary/cloudinary.module';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}

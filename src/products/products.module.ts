import { Module } from '@nestjs/common';
import { ProductsController } from './controllers';
import { ProductsService } from './services';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}

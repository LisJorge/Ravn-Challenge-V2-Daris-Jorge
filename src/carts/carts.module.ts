import { Module } from '@nestjs/common';
import { CartsService } from './services';
import { CartsController } from './controllers';
import { ProductsModule } from '@/products/products.module';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule, ProductsModule],
  providers: [CartsService],
  controllers: [CartsController]
})
export class CartsModule {}

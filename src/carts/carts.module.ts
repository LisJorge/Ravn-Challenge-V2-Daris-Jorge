import { Module } from '@nestjs/common';
import { CartsService } from './services';
import { CartsController } from './controllers';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductsModule } from '@/products/products.module';

@Module({
  imports: [PrismaModule, ProductsModule],
  providers: [CartsService],
  controllers: [CartsController]
})
export class CartsModule {}

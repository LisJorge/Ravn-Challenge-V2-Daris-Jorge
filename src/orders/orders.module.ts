import { Module } from '@nestjs/common';
import { OrdersService } from './services';
import { OrdersController } from './controllers';
import { ProductsModule } from '@/products/products.module';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule, ProductsModule],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}

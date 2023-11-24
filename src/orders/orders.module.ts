import { Module } from '@nestjs/common';
import { OrdersService } from './services/orders.service';
import { OrdersController } from './controllers/orders.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductsModule } from '@/products/products.module';

@Module({
  imports: [PrismaModule, ProductsModule],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}

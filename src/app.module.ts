import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { CartsModule } from './carts/carts.module';
import { ProductLikesModule } from './product-likes/product-likes.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    ProductsModule,
    UsersModule,
    AuthModule,
    OrdersModule,
    CartsModule,
    ProductLikesModule,
  ],
})
export class AppModule {}

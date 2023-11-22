import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
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
    CategoriesModule,
    UsersModule,
    AuthModule,
    OrdersModule,
    CartsModule,
    ProductLikesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

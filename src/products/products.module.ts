import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductsController } from './controllers';
import { ProductsService } from './services';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [PrismaModule, CategoriesModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}

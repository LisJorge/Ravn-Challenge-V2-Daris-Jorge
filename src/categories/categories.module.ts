import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CategoriesService } from './services';

@Module({
  imports: [PrismaModule],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}

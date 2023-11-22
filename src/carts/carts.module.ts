import { Module } from '@nestjs/common';
import { CartsService } from './services';
import { CartsController } from './controllers';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CartsService],
  controllers: [CartsController]
})
export class CartsModule {}

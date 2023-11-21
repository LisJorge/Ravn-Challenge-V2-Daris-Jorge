import { Module } from '@nestjs/common';
import { PrismaService } from './services';

@Module({
  exports: [PrismaService],
  providers: [PrismaService],
})
export class PrismaModule {}

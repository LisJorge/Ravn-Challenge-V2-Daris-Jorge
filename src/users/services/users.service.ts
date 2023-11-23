import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from '../dtos';
import { PrismaService } from '@/prisma/services';
import { encodePassword } from '@/auth/utils';

@Injectable()
export class UsersService {
  findOne(username: string) {
    throw new Error('Method not implemented.');
  }
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const {password, ...userData} = createUserDto;
    const hashedPassword = await encodePassword(password);
    return await this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      }
    });
  }

  async findOneByEmail(email: string ): Promise<User> {
    try {
      const user =  await this.prisma.user.findFirstOrThrow({
        where: { email },
      });
      return user;
    } catch (e) {
      throw new NotFoundException('User not found');
    }
  }
}

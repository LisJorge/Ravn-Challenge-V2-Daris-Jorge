import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/services/prisma.service';
import { CreateUserDto } from '../dtos';
import { encodePassword } from 'src/auth/utils';

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

import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from '../dtos';
import { PrismaService } from '@/prisma/services';
import { encodePassword } from '@/auth/utils';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...userData } = createUserDto;
    const hashedPassword = await encodePassword(password);
    return await this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
  }

  async findOneById(userId: number): Promise<User> {
    try {
      const user = await this.prisma.user.findFirstOrThrow({
        where: { userId },
      });
      return user;
    } catch (e) {
      throw new NotFoundException('User not found');
    }
  }

  async findOneByEmail(email: string): Promise<User | null > {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });
    return user;
  }

  async saveRefreshToken(userId: number, token: string): Promise<void> {
    await this.prisma.user.update({
      where: { userId },
      data: { refreshToken: token },
    });
  }

  async removeRefreshToken(userId: number): Promise<void> {
    await this.prisma.user.update({
      where: { userId },
      data: { refreshToken: null },
    });
  }

  async savePasswordToken(userId: number, token: string): Promise<void> {
    await this.prisma.user.update({
      where: { userId },
      data: { passwordToken: token },
    });
  }

  async removePasswordToken(userId: number): Promise<void> {
    await this.prisma.user.update({
      where: { userId },
      data: { passwordToken: null },
    });
  }
}

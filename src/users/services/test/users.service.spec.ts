import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/prisma/services';
import { Role, User } from '@prisma/client';
import { UsersService } from '../users.service';
import * as utils from '@auth/utils';

const bcrypt = require('../../../auth/utils');
 
describe('UsersService', () => {
  let service: UsersService;
  const mockPrisma = {
    user: {
      findFirstOrThrow: jest.fn(),
      create: jest.fn(),
    }
  }
  const mockUser: User = {
    userId: 1,
    email: 'email@example.com',
    name: 'John',
    lastname: 'Doe',
    password: 'pass',
    role: Role.MANAGER,
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, 
        {
          provide: PrismaService,
          useValue: mockPrisma
        },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should call prisma create method', async () => {
      jest.spyOn(service, 'create').mockImplementation(
        async (createUserDto) =>{
          return await mockPrisma.user.create({
            data: {
              ...createUserDto
            }
          });
        })
      mockPrisma.user.create.mockImplementation(() => mockUser);
      const { userId, ...userData } = mockUser;
      const request = await service.create(userData);
      expect(request).toEqual(mockUser);
      expect(mockPrisma.user.create).toHaveBeenCalled();
    });
  });

  describe('findOneByEmail', () => {
    it('should call prisma findMany method', async () => {
      const {email} = mockUser;
      await service.findOneByEmail(email);
      expect(mockPrisma.user.findFirstOrThrow).toHaveBeenCalled();
    });

    it('should throw an exception', async () => {
      const {email} = mockUser;
      mockPrisma.user.findFirstOrThrow.mockImplementationOnce(() => {throw new Error('')})
      try {
        await service.findOneByEmail(email); 
      } catch (e) {
        expect(e.message).toEqual('User not found') 
      }
    });
  })
});

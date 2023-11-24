import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/prisma/services';
import { Role } from '@prisma/client';
import { UsersService } from '../users.service';

const bcrypt = require('../../../auth/utils');
 
describe('UsersService', () => {
  let service: UsersService;
  const mockPrisma = {
    user: {
      findFirstOrThrow: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findFirst: jest.fn(),
    }
  }
  const mockUser = {
    userId: 1,
    email: 'email@example.com',
    name: 'John',
    lastname: 'Doe',
    password: 'pass',
    role: Role.MANAGER,
  }
  const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiQ0xJRU5UIiwic3ViIjoyLCJpYXQiOjE3MDA3NzMxNjAsImV4cC';

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
    it('should call prisma findFirstOrThrow method', async () => {
      const {email} = mockUser;
      await service.findOneByEmail(email);
      expect(mockPrisma.user.findFirst).toHaveBeenCalled();
    });
  })

  describe('findOneById', () => {
    it('should call prisma findFirst method', async () => {
      const {userId} = mockUser;
      await service.findOneById(userId);
      expect(mockPrisma.user.findFirstOrThrow).toHaveBeenCalled();
    });

    it('should throw an exception', async () => {
      const {userId} = mockUser;
      mockPrisma.user.findFirstOrThrow.mockImplementationOnce(() => {throw new Error('')})
      try {
        await service.findOneById(userId); 
      } catch (e) {
        expect(e.message).toEqual('User not found') 
      }
    });
  })

  describe('refreshToken', () => {
    it('save refreshToken', async () => {
      const {userId} = mockUser;
      await service.saveRefreshToken(userId, mockToken);
      expect(mockPrisma.user.update).toHaveBeenCalled();
    });

    it('delete refreshToken', async () => {
      const {userId} = mockUser;
      await service.removeRefreshToken(userId);
      expect(mockPrisma.user.update).toHaveBeenCalled();
    });
  })

  describe('passwordToken', () => {
    it('save passwordToken', async () => {
      const {userId} = mockUser;
      await service.savePasswordToken(userId, mockToken);
      expect(mockPrisma.user.update).toHaveBeenCalled();
    });

    it('delete passwordToken', async () => {
      const {userId, password} = mockUser;
      await service.removePasswordToken(userId, password);
      expect(mockPrisma.user.update).toHaveBeenCalled();
    });
  })
});

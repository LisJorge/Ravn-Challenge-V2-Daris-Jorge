import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from '@/users/services';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { AuthResponseDto } from '@/auth/dtos';

describe('AuthService', () => {
  let service: AuthService;
  const mockUserService = {
    findOneByEmail: jest.fn(),
    create: jest.fn(),
  }
  const mockJwtService = {
    sign: jest.fn(() => '')
  }

  const mockUser = {
    email: 'email@example.com',
    password: '',
    role: Role.CLIENT,
    userId: 1,
  }

  const mockAuthResponse: AuthResponseDto = {
    access_token :''
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('generateJwt', () => {
    it('should return access token', async () => {
      const request = service.generateJwt(mockUser);
      expect(request).toEqual(mockAuthResponse)
    });
  });

  describe('signUp', () => {
    it('should return access token', async () => {
      jest.spyOn(service, 'encodePassword').mockImplementation(async () => {return ''})
      mockUserService.create.mockImplementationOnce(() => ({userId: 1}))
      const createUserMock = {
        ...mockUser,
        name: 'name',
        lastname: 'lastname'
      }
      const request = await service.signUp(createUserMock);
      expect(request).toEqual(mockAuthResponse)
    });
  });

  describe('validate user', () => {
    it('should return user', async () => {
      const {email} = mockUser;
      const {password, ...userData} = mockUser;
      jest.spyOn(service, 'checkPassword' ).mockImplementationOnce(async () => {return true});
      mockUserService.findOneByEmail.mockImplementationOnce(() => {
        return {...mockUser,
        password: ''}
      })
      const request = await service.validateUser(email, password);
      expect(request).toEqual(userData)
    });
  });
});

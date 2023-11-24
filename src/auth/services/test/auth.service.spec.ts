import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from '@/users/services';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { AuthResponseDto } from '@/auth/dtos';
import { ConfigService } from '@nestjs/config';
import { MailService } from '@/mail/services/mail.service';

describe('AuthService', () => {
  let service: AuthService;
  const mockUserService = {
    findOneByEmail: jest.fn(),
    create: jest.fn(),
    saveRefreshToken: jest.fn(),
    findOneById: jest.fn(),
    removeRefreshToken: jest.fn(),
    savePasswordToken: jest.fn(),
    removePasswordToken: jest.fn(),
  };
  const mockJwtService = {
    sign: jest.fn(() => ''),
    signAsync: jest.fn(() => ''),
    decode: jest.fn(),
  };
  const mockMailService = {
    sendPasswordResetConfirmation: jest.fn(),
  };
  const mockConfigService = {
    get: jest.fn(() => ''),
  };

  const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiQ0xJRU5UIiwic3ViIjoyLCJpYXQiOjE3MDA3NzMxNjAsImV4cC';

  const mockUser = {
    email: 'email@example.com',
    password: '',
    role: Role.CLIENT,
    userId: 1,
    refreshToken: mockToken,
  };

  const mockAuthResponse: AuthResponseDto = {
    access_token: '',
    refresh_token: '',
  };

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
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return access token', async () => {
      const request = await service.login(mockUser);
      expect(request).toEqual(mockAuthResponse);
    });
  });

  describe('signUp', () => {
    it('should return access token', async () => {
      jest.spyOn(service, 'encodePassword').mockImplementation(async () => {
        return '';
      });
      mockUserService.create.mockImplementationOnce(() => ({ userId: 1 }));
      const createUserMock = {
        ...mockUser,
        name: 'name',
        lastname: 'lastname',
      };
      const request = await service.signUp(createUserMock);
      expect(request).toEqual(mockAuthResponse);
    });
    it('should throw an exception', async () => {
      mockUserService.findOneByEmail.mockImplementationOnce(() => ({ userId: 1 }));
      const createUserMock = {
        ...mockUser,
        name: 'name',
        lastname: 'lastname',
      };
      const errosMessage = 'User already exists'
      try{
        const request = await service.signUp(createUserMock);
      } catch(e){
        expect(e.message).toEqual('User already exists');
      }
    });
  });

  describe('validateUser', () => {
    it('should return user', async () => {
      const { email } = mockUser;
      const { password, ...userData } = mockUser;
      jest.spyOn(service, 'checkPassword').mockImplementationOnce(async () => {
        return true;
      });
      mockUserService.findOneByEmail.mockImplementationOnce(() => {
        return { ...mockUser, password: '' };
      });
      const request = await service.validateUser(email, password);
      expect(request).toEqual(userData);
    });

    it('should return null, password not match', async () => {
      const { email } = mockUser;
      const { password, ...userData } = mockUser;
      jest.spyOn(service, 'checkPassword').mockImplementationOnce(async () => {
        return false;
      });
      mockUserService.findOneByEmail.mockImplementationOnce(() => {
        return { ...mockUser, password: '' };
      });
      const request = await service.validateUser(email, password);
      expect(request).toEqual(null);
    });

    it('should return null, user not found', async () => {
      const { email } = mockUser;
      const { password, ...userData } = mockUser;
      mockUserService.findOneByEmail.mockImplementationOnce(() => {
        return null;
      });
      const request = await service.validateUser(email, password);
      expect(request).toEqual(null);
    });
  });

  describe('refreshTokens', () => {
    const errorMessage = 'Access Denied';
    it('user have refresh token', async () => {
      mockUserService.findOneById.mockImplementationOnce(() => { return mockUser })
      await service.refreshTokens(mockUser.userId, mockToken);
      expect(mockUserService.saveRefreshToken).toHaveBeenCalled();
    })

    it('user does not have refresh token', async () => {
      mockUserService.findOneById.mockImplementationOnce(() => { return {
        ...mockUser,
        refreshToken: null,
      } })
      try {
        await service.refreshTokens(mockUser.userId, mockToken); 
      } catch (e) {
        expect(e.message).toEqual(errorMessage); 
      }
    })

    it('refresh tokens do not match', async () => {
      const mockTokenNotMatched = '12344567';
      mockUserService.findOneById.mockImplementationOnce(() => { return {
        ...mockUser,
        refreshToken: mockTokenNotMatched,
      } })
      try {
        await service.refreshTokens(mockUser.userId, mockToken); 
      } catch (e) {
        expect(e.message).toEqual(errorMessage); 
      }
    })
  })


  describe('signOut', () => {
    it('should call removeRefreshToken method from user service', async () => {
      const { userId } = mockUser;
      await service.signOut(userId);
      expect(mockUserService.removeRefreshToken).toHaveBeenCalled()
    })
  })

  describe('forgotPassword', () => {
    it('should return token', async () => {
      const { email } = mockUser;
      mockUserService.findOneByEmail.mockImplementationOnce(() => ({ userId: 1 }));
      await service.forgotPassword(email);
      expect(mockUserService.savePasswordToken).toHaveBeenCalled();
    })

    it('should throw an exception', async () => {
      const { email } = mockUser;
      const errorMessage = 'User does not exist'
      mockUserService.findOneByEmail.mockImplementationOnce(() => (null));
      try {
        await service.forgotPassword(email);
      } catch (e) {
        expect(e.message).toEqual(errorMessage); 
      }
    })
  })

  describe('resetPassword', () => {
    it('should call removePasswordToken method from user service and sendPasswordConfirmation from mail service', async () => {
      const { email } = mockUser;
      mockJwtService.decode.mockImplementation(() => {email})
      jest.spyOn(service, 'encodePassword').mockImplementationOnce(async () => {
        return mockToken;
      });
      mockUserService.findOneByEmail.mockImplementationOnce(() => {
        return {...mockUser,
        passwordToken: mockToken}
      });
      await service.resetPassword(mockToken, '');
      expect(mockUserService.removePasswordToken).toHaveBeenCalled()
      expect(mockMailService.sendPasswordResetConfirmation).toHaveBeenCalled()
    })
  })
});

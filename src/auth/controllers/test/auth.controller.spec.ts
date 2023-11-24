import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '@/auth/services';
import { ForgotPasswordDto, SignUpUserDto } from '@/auth/dtos';
import { ResetPasswordDto } from '@/auth/dtos/reset-password.dto';

describe('AuthController', () => {
  let controller: AuthController;
  const mockAuthService = {
    login: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    refreshTokens: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthController,
        {
          provide: AuthService,
          useValue: mockAuthService,
        }
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('signup', () => {
    const mockSignUpDto: SignUpUserDto = {
      name: 'name',
      lastname: 'lastname',
      email: 'email',
      password: 'password',
    }
    it('should call signup method from authService', async () => {
      await controller.signUp(mockSignUpDto);
      expect(mockAuthService.signUp).toHaveBeenCalled();
    });
  });

  describe('forgotPassword', () => {
    it('should call forgotPassword method from authService', async () => {
      const mockForgotPassword: ForgotPasswordDto = {
        email: 'email',
      }
      await controller.forgotPassword(mockForgotPassword);
      expect(mockAuthService.forgotPassword).toHaveBeenCalled();
    });
  });

  describe('reset-password', () => {
    it('should call reset-password method from authService', async () => {
      const mockResetPassword: ResetPasswordDto = {
        password: 'password',
        token: 'token',
      }
      await controller.resetPassword(mockResetPassword);
      expect(mockAuthService.resetPassword).toHaveBeenCalled();
    });
  });
});

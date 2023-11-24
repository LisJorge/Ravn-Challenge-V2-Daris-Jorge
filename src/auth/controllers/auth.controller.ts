import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../services';
import { Request } from 'express';
import { AuthUserDto, ForgotPasswordDto, SignUpUserDto } from '../dtos';
import { AuthGuard } from '@nestjs/passport';
import { Public } from '../decorators';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthResponseDto } from '../dtos/auth-response.dto';
import { JwtAuthGuard, RefreshTokenGuard } from '../guards';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { BAD_REQUEST_RESPONSE, FORBIDDEN_RESPONSE, GENERAL_RESPONSE, NOT_FOUND_EXCEPTION, UNAUTHORIZED_RESPONSE } from '@/common/api-responses';

@Public()
@ApiTags('Auth')
@Controller('auth')
@ApiResponse(GENERAL_RESPONSE)
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiResponse(UNAUTHORIZED_RESPONSE)
  login(@Req() req: Request): Promise<AuthResponseDto> {
    const user = req.user as AuthUserDto;
    return this.authService.login(user);
  }

  @Post('sign-up')
  @ApiResponse(BAD_REQUEST_RESPONSE)
  signUp(@Body() signUpUserDto: SignUpUserDto): Promise<AuthResponseDto> {
    return this.authService.signUp(signUpUserDto);
  }

  @Post('sign-out')
  @UseGuards(JwtAuthGuard)
  logout(@Req() req: Request): Promise<void> {
    return this.authService.signOut(req.user['sub']);
  }

  @UseGuards(RefreshTokenGuard)
  @ApiResponse(FORBIDDEN_RESPONSE)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Post('forgot-password')
  @ApiResponse(NOT_FOUND_EXCEPTION)
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto ): Promise<string> {
    const {email} = forgotPasswordDto;
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  @ApiResponse(BAD_REQUEST_RESPONSE)
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { token, password } = resetPasswordDto;
    return this.authService.resetPassword(token, password);
  }
}

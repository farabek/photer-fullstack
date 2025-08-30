import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'Registration successful' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.name,
    );
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth login' })
  async googleAuth() {
    // Guard will handle the authentication
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleAuthRedirect(@Req() req, @Res() res) {
    const result = await this.authService.validateOAuthUser(req.user, 'google');
    // Redirect to frontend with token
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?token=${result.access_token}`,
    );
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'GitHub OAuth login' })
  async githubAuth() {
    // Guard will handle the authentication
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'GitHub OAuth callback' })
  async githubAuthRedirect(@Req() req, @Res() res) {
    const result = await this.authService.validateOAuthUser(req.user, 'github');
    // Redirect to frontend with token
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?token=${result.access_token}`,
    );
  }
}

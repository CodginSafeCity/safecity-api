import { Controller, Post, Request, UseGuards, Res, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

// @ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('login-test')
  @ApiBody({ type: LoginDto })
  async loginTest(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      return { message: 'Credenciales inválidas' };
    }

    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  @ApiBearerAuth('access-token')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('jwt');
    return res.json({ message: 'Logout exitoso' });
  }
}

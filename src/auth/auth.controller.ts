import {
  Controller,
  Post,
  Get,
  Request,
  UseGuards,
  Res,
  Body,
  HttpException,
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiTags,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse
} from '@nestjs/swagger';
import {
  LoginResponseDto,
  LoginErrorDto,
} from './dto/login-response.dto';
import { RegisterDto } from './dto/register.dto';
import { UserProfileResponseDto } from './dto/userProfile-response.dto';
import { LogoutResponseDto } from './dto/logout-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ApiBody({ type: RegisterDto })
  @ApiOkResponse({ description: 'Usuario registrado exitosamente', type: UserProfileResponseDto })
  @ApiConflictResponse({ description: 'El usuario ya existe' })
  async register(@Body() registerDto: RegisterDto) {

    const existingUser = await this.authService.findUserByEmail(registerDto.email);
    if (existingUser) {
      throw new HttpException('El usuario ya existe', HttpStatus.CONFLICT);
    }

    const user = await this.authService.registerWithCitizenRole(registerDto);
    return user;
  }


  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'Login exitoso', type: LoginResponseDto })
  @ApiUnauthorizedResponse({ description: 'Credenciales inválidas', type: LoginErrorDto })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      return { message: 'Credenciales inválidas' };
    }

    return this.authService.login(user);
  }

  @Post('login-test')
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'Login de prueba exitoso', type: LoginResponseDto })
  @ApiUnauthorizedResponse({ description: 'Credenciales inválidas', type: LoginErrorDto })
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
  @Get('profile')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Perfil del usuario autenticado', type: UserProfileResponseDto })
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(200)
  @ApiOkResponse({ description: 'Logout exitoso', type: LogoutResponseDto })
  async logout(@Res() res: Response) {
    res.clearCookie('jwt');
    return res.json({ message: 'Logout exitoso' });
  }
}

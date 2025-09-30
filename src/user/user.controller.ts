import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './user.entity';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ResetResponseDto } from './dto/reset-response.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { ForgotResponseDto } from './dto/forgot-response.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@ApiBadRequestResponse({ description: 'Bad request' })
@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) { }

  @ApiOkResponse({
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.userService.create(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
      data: this.toResponse(user),
    };
  }

  @ApiOkResponse({
    description: 'Users retrieved successfully',
    type: [UserResponseDto],
  })
  @Get()
  async find() {
    const users = await this.userService.find();
    return {
      statusCode: HttpStatus.OK,
      message: 'Users retrieved successfully',
      data: users.map(this.toResponse),
    };
  }

  @ApiOkResponse({
    description: 'User retrieved successfully',
    type: UserResponseDto,
  })
  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.userService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'User retrieved successfully',
      data: this.toResponse(user),
    };
  }

  @ApiOkResponse({
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
  ) {
    const user = await this.userService.update(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'User updated successfully',
      data: this.toResponse(user),
    };
  }

  @ApiOkResponse({
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @Patch(':id')
  async patch(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
  ) {
    const user = await this.userService.update(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'User updated successfully',
      data: this.toResponse(user),
    };
  }

  @ApiOkResponse({
    description: 'User deleted successfully',
    type: UserResponseDto,
  })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.userService.delete(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'User deleted successfully',
      data: this.toResponse(user),
    };
  }

  @ApiBody({ type: ForgotPasswordDto })
  @ApiOkResponse({
    description: 'Forgot password request successful',
    type: ForgotResponseDto,
  })
  @Post('forgot-password')
  @Public()
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    const token = await this.userService.generateResetToken(dto.email);
    return {
      message: 'Se ha enviado un correo con instrucciones',
      token,
    };
  }

  @ApiBody({ type: ResetPasswordDto })
  @ApiOkResponse({
    description: 'Password reset successfully',
    type: ResetResponseDto,
  })
  @Post('reset-password')
  @Public()
  async resetPassword(@Body() dto: ResetPasswordDto) {
    const user = await this.userService.resetPassword(dto.email, dto);
    return {
      message: 'Contraseña actualizada correctamente',
      data: { id: user.id, email: user.email },
    };
  }

  private toResponse(user: UserEntity): UserResponseDto {
    return {
      id: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      name: user.name,
      last_name: user.last_name,
      email: user.email,
      avatar: user.avatar,
      role: user.role
        ? {
          id: user.role.id,
          name: user.role.name,
          description: user.role.description,
        }
        : undefined,
      city: user.city
        ? {
          id: user.city.id,
          name: user.city.name,
        }
        : undefined,
    };
  }
}
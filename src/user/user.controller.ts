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

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@ApiBadRequestResponse({ description: 'Bad request' })
@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({
    description: 'User created successfully',
    type: UserEntity,
  })
  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.userService.create(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
      data: user,
    };
  }

  @ApiOkResponse({
    description: 'Users retrieved successfully',
    type: [UserEntity],
  })
  @Get()
  async find() {
    const users = await this.userService.find();
    return {
      statusCode: HttpStatus.OK,
      message: 'Users retrieved successfully',
      data: users,
    };
  }

  @ApiOkResponse({
    description: 'User retrieved successfully',
    type: UserEntity,
  })
  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.userService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'User retrieved successfully',
      data: user,
    };
  }

  @ApiOkResponse({
    description: 'User updated successfully',
    type: UserEntity,
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
      data: user,
    };
  }

  @ApiOkResponse({
    description: 'User updated successfully',
    type: UserEntity,
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
      data: user,
    };
  }

  @ApiOkResponse({
    description: 'User deleted successfully',
    type: UserEntity,
  })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.userService.delete(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'User deleted successfully',
      data: user,
    };
  }
}

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
import { IncidentCategoryService } from './incident-category.service';
import { CreateIncidentCategoryDto } from './dto/create-incident-category.dto';
import { UpdateIncidentCategoryDto } from './dto/update-incident-category.dto';
import {
  CreateIncidentCategoryResponseDto,
  FindIncidentCategoriesResponseDto,
  FindIncidentCategoryResponseDto,
  UpdateIncidentCategoryResponseDto,
  DeleteIncidentCategoryResponseDto,
} from './dto/incident-category-response.dto';

@ApiTags('incident-categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@ApiBadRequestResponse({ description: 'Bad request' })
@Controller('incident-categories')
export class IncidentCategoryController {
  private readonly logger = new Logger(IncidentCategoryController.name);

  constructor(
    private readonly incidentCategoryService: IncidentCategoryService,
  ) {}

  @ApiOkResponse({
    description: 'Incident category created successfully',
    type: CreateIncidentCategoryResponseDto,
  })
  @Post()
  async create(@Body() dto: CreateIncidentCategoryDto) {
    const category = await this.incidentCategoryService.create(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Incident category created successfully',
      data: category,
    };
  }

  @ApiOkResponse({
    description: 'Incident categories retrieved successfully',
    type: FindIncidentCategoriesResponseDto,
  })
  @Get()
  async find() {
    const categories = await this.incidentCategoryService.find();
    return {
      statusCode: HttpStatus.OK,
      message: 'Incident categories retrieved successfully',
      data: categories,
    };
  }

  @ApiOkResponse({
    description: 'Incident category retrieved successfully',
    type: FindIncidentCategoryResponseDto,
  })
  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    const category = await this.incidentCategoryService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Incident category retrieved successfully',
      data: category,
    };
  }

  @ApiOkResponse({
    description: 'Incident category updated successfully',
    type: UpdateIncidentCategoryResponseDto,
  })
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateIncidentCategoryDto,
  ) {
    const category = await this.incidentCategoryService.update(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Incident category updated successfully',
      data: category,
    };
  }

  @ApiOkResponse({
    description: 'Incident category updated successfully',
    type: UpdateIncidentCategoryResponseDto,
  })
  @Patch(':id')
  async patch(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateIncidentCategoryDto,
  ) {
    const category = await this.incidentCategoryService.update(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Incident category updated successfully',
      data: category,
    };
  }

  @ApiOkResponse({
    description: 'Incident category deleted successfully',
    type: DeleteIncidentCategoryResponseDto,
  })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    const category = await this.incidentCategoryService.delete(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Incident category deleted successfully',
      data: category,
    };
  }
}

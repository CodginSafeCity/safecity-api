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
  Query,
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
import { AvailabilityZonesService } from './availability-zones.service';
import { CreateAvailabilityZoneDto } from './dto/create-availability-zone.dto';
import { UpdateAvailabilityZoneDto } from './dto/update-availability-zone.dto';
import {
  CreateAvailabilityZoneResponseDto,
  FindAvailabilityZonesResponseDto,
  FindAvailabilityZoneByIdResponseDto,
  UpdateAvailabilityZoneResponseDto,
  PatchAvailabilityZoneResponseDto,
  DeleteAvailabilityZoneResponseDto,
} from './dto/availability-zone-response.dto';
import { AvailabilityZoneDto } from './dto/availability-zone.dto';
import { AvailabilityZoneQueryFilterDto } from './dto/availability-zone-find-options.dto';

@ApiTags('availability-zones')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@ApiBadRequestResponse({ description: 'Bad request' })
@Controller('availability-zones')
export class AvailabilityZonesController {
  private readonly logger = new Logger(AvailabilityZonesController.name);

  constructor(private readonly availabilityZonesService: AvailabilityZonesService) {}

  @ApiOkResponse({
    description: 'Availability Zone created successfully',
    type: CreateAvailabilityZoneResponseDto,
  })
  @Post()
  async create(@Body() dto: CreateAvailabilityZoneDto) {
    const zone = await this.availabilityZonesService.create(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Availability Zone created successfully',
      data: AvailabilityZoneDto.fromEntity(zone),
    };
  }

  @ApiOkResponse({
    description: 'Availability Zones retrieved successfully',
    type: FindAvailabilityZonesResponseDto,
  })
  @Get()
  async find(@Query() findOptions: AvailabilityZoneQueryFilterDto) {
    const zones = await this.availabilityZonesService.find(findOptions);
    return {
      statusCode: HttpStatus.OK,
      message: 'Availability Zones retrieved successfully',
      data: zones.data.map(AvailabilityZoneDto.fromEntity),
      total: zones.total,
      limit: findOptions.limit ?? 0,
      offset: findOptions.offset ?? 0,
    };
  }

  @ApiOkResponse({
    description: 'Availability Zone retrieved successfully',
    type: FindAvailabilityZoneByIdResponseDto,
  })
  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    const zone = await this.availabilityZonesService.findById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Availability Zone retrieved successfully',
      data: AvailabilityZoneDto.fromEntity(zone),
    };
  }

  @ApiOkResponse({
    description: 'Availability Zone updated successfully',
    type: UpdateAvailabilityZoneResponseDto,
  })
  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateAvailabilityZoneDto) {
    const zone = await this.availabilityZonesService.update(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Availability Zone updated successfully',
      data: AvailabilityZoneDto.fromEntity(zone),
    };
  }

  @ApiOkResponse({
    description: 'Availability Zone partially updated successfully',
    type: PatchAvailabilityZoneResponseDto,
  })
  @Patch(':id')
  async patch(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateAvailabilityZoneDto) {
    const zone = await this.availabilityZonesService.update(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Availability Zone partially updated successfully',
      data: AvailabilityZoneDto.fromEntity(zone),
    };
  }

  @ApiOkResponse({
    description: 'Availability Zone deleted successfully',
    type: DeleteAvailabilityZoneResponseDto,
  })
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    const zone = await this.availabilityZonesService.delete(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Availability Zone deleted successfully',
      data: AvailabilityZoneDto.fromEntity(zone),
    };
  }
}
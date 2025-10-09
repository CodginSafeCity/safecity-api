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
import { ControlEntityService } from 'src/control-entities/control-entities.service';
// import { CreateAvailabilityZoneDto } from './dto/create-availability-zone.dto';
// import { UpdateAvailabilityZoneDto } from './dto/update-availability-zone.dto';
// import {
//   CreateAvailabilityZoneResponseDto,
//   FindAvailabilityZonesResponseDto,
//   FindAvailabilityZoneByIdResponseDto,
//   UpdateAvailabilityZoneResponseDto,
//   PatchAvailabilityZoneResponseDto,
//   DeleteAvailabilityZoneResponseDto,
// } from './dto/availability-zone-response.dto';
// import {
//     FindControlEntityByUserResponseDto
// } from './dto/control-entity-response.dto'
import {
    ControlEntityUserResponseDto
} from './dto/control-entity-user-response.dto'
import { ControlEntityDto } from './dto/control-entity.dto';
// import { AvailabilityZoneQueryFilterDto } from './dto/availability-zone-find-options.dto';

@ApiTags('availability-zones')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@ApiBadRequestResponse({ description: 'Bad request' })
@Controller('availability-zones')
export class ControlEntityController {
    private readonly logger = new Logger(ControlEntityController.name);

    constructor(private readonly controlEntityService: ControlEntityService) { }

    @ApiOkResponse({
        description: 'Availability Zone retrieved successfully'
    })
    @Get('control-entities/:id/users')
    async findById(@Param('id', ParseUUIDPipe) id: string) {
        const users = await this.controlEntityService.findUsersByControlEntityId(id);
        return {
            statusCode: HttpStatus.OK,
            message: 'Usuarios asociados obtenidos correctamente',
            data: users.map(ControlEntityUserResponseDto.fromEntity),
        };
    }

    //   @ApiOkResponse({
    //     description: 'Availability Zone created successfully',
    //     type: CreateAvailabilityZoneResponseDto,
    //   })
    //   @Post()
    //   async create(@Body() dto: CreateAvailabilityZoneDto) {
    //     const zone = await this.availabilityZonesService.create(dto);
    //     return {
    //       statusCode: HttpStatus.CREATED,
    //       message: 'Availability Zone created successfully',
    //       data: AvailabilityZoneDto.fromEntity(zone),
    //     };
    //   }

    // @ApiOkResponse({
    //     description: 'Availability Zones retrieved successfully with pagination',
    //     type: FindControlEntityByUserResponseDto,
    // })
    // @Get('control-entities/:id/users')
    // async find(@Query() findOptions: AvailabilityZoneQueryFilterDto) {
    //     const zones = await this.availabilityZonesService.find(findOptions);
    //     return {
    //         statusCode: HttpStatus.OK,
    //         message: 'Availability Zones retrieved successfully with pagination',
    //         data: zones.data.map(AvailabilityZoneDto.fromEntity),
    //         total: zones.total,
    //         limit: findOptions.limit ?? 0,
    //         offset: findOptions.offset ?? 0,
    //     };
    // }

    //   @ApiOkResponse({
    //     description: 'Availability Zone retrieved successfully',
    //     type: FindAvailabilityZoneByIdResponseDto,
    //   })
    //   @Get(':id')
    //   async findById(@Param('id', ParseUUIDPipe) id: string) {
    //     const zone = await this.availabilityZonesService.findById(id);
    //     return {
    //       statusCode: HttpStatus.OK,
    //       message: 'Availability Zone retrieved successfully',
    //       data: AvailabilityZoneDto.fromEntity(zone),
    //     };
    //   }

    //   @ApiOkResponse({
    //     description: 'Availability Zone updated successfully',
    //     type: UpdateAvailabilityZoneResponseDto,
    //   })
    //   @Put(':id')
    //   async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateAvailabilityZoneDto) {
    //     const zone = await this.availabilityZonesService.update(id, dto);
    //     return {
    //       statusCode: HttpStatus.OK,
    //       message: 'Availability Zone updated successfully',
    //       data: AvailabilityZoneDto.fromEntity(zone),
    //     };
    //   }

    //   @ApiOkResponse({
    //     description: 'Availability Zone partially updated successfully',
    //     type: PatchAvailabilityZoneResponseDto,
    //   })
    //   @Patch(':id')
    //   async patch(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateAvailabilityZoneDto) {
    //     const zone = await this.availabilityZonesService.update(id, dto);
    //     return {
    //       statusCode: HttpStatus.OK,
    //       message: 'Availability Zone partially updated successfully',
    //       data: AvailabilityZoneDto.fromEntity(zone),
    //     };
    //   }

    //   @ApiOkResponse({
    //     description: 'Availability Zone deleted successfully',
    //     type: DeleteAvailabilityZoneResponseDto,
    //   })
    //   @Delete(':id')
    //   async delete(@Param('id', ParseUUIDPipe) id: string) {
    //     const zone = await this.availabilityZonesService.delete(id);
    //     return {
    //       statusCode: HttpStatus.OK,
    //       message: 'Availability Zone deleted successfully',
    //       data: AvailabilityZoneDto.fromEntity(zone),
    //     };
    //   }
}
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
    Query
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
import { IncidentService } from './incident.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { IncidentDto } from './dto/incident.dto';
import { ListIncidentsResponseDto } from './dto/list-incidents-response.dto';
import { IncidentEntity } from './incident.entity';
import {
    IncidentFindOptionsDto,
    IncidentQueryFilterDto,
} from './dto/incident-find-options.dto';

@ApiTags('incidents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@ApiBadRequestResponse({ description: 'Bad request' })
@Controller('incidents')
export class IncidentController {
    private readonly logger = new Logger(IncidentController.name);

    constructor(private readonly incidentService: IncidentService) { }

    @ApiOkResponse({
        description: 'Incident created successfully',
        type: IncidentEntity,
    })
    @Post()
    async create(@Body() dto: CreateIncidentDto) {
        const incident = await this.incidentService.create(dto);
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Incident created successfully',
            data: incident,
        };
    }

    @ApiOkResponse({
        description: 'Incidents retrieved successfully with pagination',
        type: ListIncidentsResponseDto,
    })
    @Get()
    async find(@Query() findOptions: IncidentFindOptionsDto) {
        this.logger.debug('Retrieving incidents');
        this.logger.debug('Received findOptions:', { findOptions });

        const incidents = await this.incidentService.find(
            IncidentQueryFilterDto.create(findOptions),
        );

        return new ListIncidentsResponseDto(
            HttpStatus.OK,
            'Incidents retrieved successfully',
            incidents.data.map(IncidentDto.fromEntity),
            incidents.total,
            findOptions.limit ?? 0,
            findOptions.offset ?? 0,
        );
    }


    @ApiOkResponse({
        description: 'Incident retrieved successfully',
        type: IncidentEntity,
    })
    @Get(':id')
    async findById(@Param('id', ParseUUIDPipe) id: string) {
        const incident = await this.incidentService.findById(id);
        return {
            statusCode: HttpStatus.OK,
            message: 'Incident retrieved successfully',
            data: incident,
        };
    }

    @ApiOkResponse({
        description: 'Incident updated successfully',
        type: IncidentEntity,
    })
    @Put(':id')
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateIncidentDto,
    ) {
        const incident = await this.incidentService.update(id, dto);
        return {
            statusCode: HttpStatus.OK,
            message: 'Incident updated successfully',
            data: incident,
        };
    }

    @ApiOkResponse({
        description: 'Incident partially updated successfully',
        type: IncidentEntity,
    })
    @Patch(':id')
    async patch(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateIncidentDto,
    ) {
        const incident = await this.incidentService.update(id, dto);
        return {
            statusCode: HttpStatus.OK,
            message: 'Incident partially updated successfully',
            data: incident,
        };
    }

    @ApiOkResponse({
        description: 'Incident deleted successfully',
        type: IncidentEntity,
    })
    @Delete(':id')
    async delete(@Param('id', ParseUUIDPipe) id: string) {
        const incident = await this.incidentService.delete(id);
        return {
            statusCode: HttpStatus.OK,
            message: 'Incident deleted successfully',
            data: incident,
        };
    }

    @ApiOkResponse({
        description: 'Incidents by user retrieved successfully',
        type: [IncidentEntity],
    })
    @Get('user/:userId')
    async findByUser(@Param('userId', ParseUUIDPipe) userId: string) {
        const incidents = await this.incidentService.findByUser(userId);
        return {
            statusCode: HttpStatus.OK,
            message: 'Incidents by user retrieved successfully',
            data: incidents,
        };
    }
}

import {
    Controller,
    Query,
    Get,
    Post,
    HttpStatus,
    Body,
    Logger,
    Param,
    ParseUUIDPipe,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
    ApiParam,
    ApiQuery
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ControlEntityService } from 'src/control-entities/control-entities.service';
import { ControlEntityUserResponseDto } from './dto/control-entity-user-response.dto';
import { UserService } from 'src/user/user.service';
import { IncidentService } from 'src/incidents/incident.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { CreateControlEntityUserDto } from './dto/create-control-entity-user.dto';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { CreateControlEntityDto } from './dto/create-control-entity.dto';
import { ControlEntityResponseDto } from './dto/control-entity-response.dto';
import { FindIncidentsResponseDto } from 'src/incidents/dto/incident-response.dto';
import { IncidentDto } from 'src/incidents/dto/incident.dto';
import { IncidentStatus } from 'src/incidents/incident.types';
import { GroupByStatusResponseDto } from 'src/incidents/dto/group-by-status-response.dto';


@ApiTags('control-entities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@ApiBadRequestResponse({ description: 'Bad request' })
@Controller('control-entities')
export class ControlEntityController {
    private readonly logger = new Logger(ControlEntityController.name);
    constructor(
        private readonly controlEntityService: ControlEntityService,
        private readonly userService: UserService,
        private readonly incidentService: IncidentService,
    ) { }

    @ApiOkResponse({
        description: 'Incidents grouped by status for a control entity',
        type: GroupByStatusResponseDto,
    })
    @ApiParam({
        name: 'id',
        type: String,
        description: 'UUID de la entidad de control',
    })
    @Get(':id/groupByStatus')
    async groupByStatus(@Param('id', ParseUUIDPipe) id: string) {
        const result = await this.controlEntityService.groupByStatus(id);
        return {
            statusCode: 200,
            message: 'Incidents grouped by status',
            data: result,
        };
    }

    @ApiParam({
        name: 'id',
        type: String,
        description: 'UUID de la entidad de control',
    })
    @ApiOkResponse({
        description: 'Usuarios asociados a la entidad de control obtenidos correctamente',
        type: [ControlEntityUserResponseDto],
    })
    @Get(':id/users')
    async findById(@Param('id', ParseUUIDPipe) id: string) {
        const users = await this.controlEntityService.findUsersByControlEntityId(id);
        return {
            statusCode: HttpStatus.OK,
            message: 'Usuarios asociados obtenidos correctamente',
            data: users.map(ControlEntityUserResponseDto.fromEntity),
        };
    }

    @ApiOkResponse({
        description: 'Verifier created successfully',
        type: UserResponseDto,
    })
    @Post(':id/users')
    async createVerifier(@Body() dto: CreateControlEntityUserDto) {
        const user = await this.userService.createVerifier(dto);
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Verifier created successfully',
            data: CreateControlEntityUserDto.fromEntity(user),
        };
    }

    @ApiOkResponse({
        description: 'Control Entity created successfully',
        type: ControlEntityResponseDto,
    })
    @Post()
    async create(@Body() dto: CreateControlEntityDto) {
        const entity = await this.controlEntityService.create(dto);
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Control Entity created successfully',
            data: ControlEntityResponseDto.fromEntity(entity),
        };
    }

    @ApiParam({
        name: 'id',
        type: String,
        description: 'UUID de la entidad de control',
    })
    @ApiQuery({
        name: 'status',
        required: false,
        enum: IncidentStatus,
        description: 'Filtrar incidentes por estado (opcional)',
    })
    @ApiOkResponse({
        description: 'Incidents by control entity retrieved successfully',
        type: FindIncidentsResponseDto,
    })
    @Get(':id/incidents')
    async findIncidentsByControlEntity(
        @Param('id', ParseUUIDPipe) id: string,
        @Query('status') status?: IncidentStatus,
    ): Promise<FindIncidentsResponseDto> {
        const incidents = await this.incidentService.findByControlEntity(id, status);

        return {
            statusCode: HttpStatus.OK,
            message: 'Incidents retrieved successfully for control entity',
            data: incidents.map(IncidentDto.fromEntity),
            total: incidents.length,
            limit: incidents.length,
            offset: 0,
        };
    }

    @ApiOkResponse({
        description: 'All control entities retrieved successfully',
        type: [ControlEntityResponseDto],
    })
    @Get()
    async findAllControlEntities() {
        const entities = await this.controlEntityService.findAll();
        return {
            statusCode: HttpStatus.OK,
            message: 'Control entities retrieved successfully',
            data: entities.map(ControlEntityResponseDto.fromEntity),
        };
    }
}

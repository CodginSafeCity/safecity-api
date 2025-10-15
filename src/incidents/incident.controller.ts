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
    Query,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiConsumes,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
    ApiBody
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IncidentService } from './incident.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import {
    CreateIncidentResponseDto,
    FindIncidentsResponseDto,
    FindIncidentByIdResponseDto,
    UpdateIncidentResponseDto,
    PatchIncidentResponseDto,
    DeleteIncidentResponseDto,
    FindIncidentsByUserResponseDto,
} from './dto/incident-response.dto';
import { UploadIncidentFileResponseDto } from './dto/upload-incident-file-reponse.dto';
import { IncidentFindOptionsDto } from './dto/incident-find-options.dto';
import { IncidentDto } from './dto/incident.dto';
import { IncidentQueryFilterDto } from './dto/incident-find-options.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import { UploadIncidentFileDto } from './dto/upload-incident-file.dto';

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
        description: 'Incidents grouped by status',
    })
    @Get('groupByStatus')
    async groupByStatus() {
        const result = await this.incidentService.groupByStatus();
        return {
            statusCode: 200,
            message: 'Incidents grouped by status',
            data: result,
        };
    }

    @ApiOkResponse({
        description: 'Incident created successfully',
        type: CreateIncidentResponseDto,
    })
    @Post()
    async create(@Body() dto: CreateIncidentDto) {
        const incident = await this.incidentService.create(dto);
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Incident created successfully',
            data: IncidentDto.fromEntity(incident),
        };
    }

    @ApiOkResponse({
        description: 'Incident file uploaded successfully',
        type: UploadIncidentFileResponseDto,
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: UploadIncidentFileDto })
    @Post(':id/upload-file')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @Param('id', ParseUUIDPipe) incidentId: string,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<any> {
        const incident = await this.incidentService.uploadFile(incidentId, file);
        return {
            statusCode: HttpStatus.CREATED,
            message: 'File uploaded successfully',
            data: {
                id: incident.id,
                fileUrl: incident.fileUrl,
            },
        };
    }


    @ApiOkResponse({
        description: 'Incidents retrieved successfully with pagination',
        type: FindIncidentsResponseDto,
    })
    @Get()
    async find(@Query() findOptions: IncidentFindOptionsDto) {
        const filter = IncidentQueryFilterDto.create(findOptions);
        const incidents = await this.incidentService.find(filter);

        return {
            statusCode: HttpStatus.OK,
            message: 'Incidents retrieved successfully with pagination',
            data: incidents.data.map(IncidentDto.fromEntity),
            total: incidents.total,
            limit: findOptions.limit ?? 0,
            offset: findOptions.offset ?? 0,
        };
    }

    @ApiOkResponse({
        description: 'Incident retrieved successfully',
        type: FindIncidentByIdResponseDto,
    })
    @Get(':id')
    async findById(@Param('id', ParseUUIDPipe) id: string) {
        const incident = await this.incidentService.findById(id);
        return {
            statusCode: HttpStatus.OK,
            message: 'Incident retrieved successfully',
            data: IncidentDto.fromEntity(incident),
        };
    }

    @ApiOkResponse({
        description: 'Incident updated successfully',
        type: UpdateIncidentResponseDto,
    })
    @Put(':id')
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateIncidentDto) {
        const incident = await this.incidentService.update(id, dto);
        return {
            statusCode: HttpStatus.OK,
            message: 'Incident updated successfully',
            data: IncidentDto.fromEntity(incident),
        };
    }

    @ApiOkResponse({
        description: 'Incident partially updated successfully',
        type: PatchIncidentResponseDto,
    })
    @Patch(':id')
    async patch(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateIncidentDto) {
        const incident = await this.incidentService.update(id, dto);
        return {
            statusCode: HttpStatus.OK,
            message: 'Incident partially updated successfully',
            data: IncidentDto.fromEntity(incident),
        };
    }

    @ApiOkResponse({
        description: 'Incident deleted successfully',
        type: DeleteIncidentResponseDto,
    })
    @Delete(':id')
    async delete(@Param('id', ParseUUIDPipe) id: string) {
        const incident = await this.incidentService.delete(id);
        return {
            statusCode: HttpStatus.OK,
            message: 'Incident deleted successfully',
            data: IncidentDto.fromEntity(incident),
        };
    }

    @ApiOkResponse({
        description: 'Incidents by user retrieved successfully',
        type: FindIncidentsByUserResponseDto,
    })
    @Get('user/:userId')
    async findByUser(@Param('userId', ParseUUIDPipe) userId: string) {
        const incidents = await this.incidentService.findByUser(userId);
        return {
            statusCode: HttpStatus.OK,
            message: 'Incidents by user retrieved successfully',
            data: incidents.map(IncidentDto.fromEntity),
        };
    }
}

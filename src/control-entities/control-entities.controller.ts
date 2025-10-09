import {
    Controller,
    Get,
    HttpStatus,
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
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ControlEntityService } from 'src/control-entities/control-entities.service';
import { ControlEntityUserResponseDto } from './dto/control-entity-user-response.dto';

@ApiTags('control-entities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@ApiBadRequestResponse({ description: 'Bad request' })
@Controller('control-entities')
export class ControlEntityController {
    private readonly logger = new Logger(ControlEntityController.name);

    constructor(private readonly controlEntityService: ControlEntityService) { }

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
}

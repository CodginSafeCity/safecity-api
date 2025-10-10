import {
    Controller,
    Get,
    Post,
    UseGuards,
    Body,
    HttpException,
    HttpStatus,
    Query
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiTags,
    ApiOkResponse,
    ApiConflictResponse,
} from '@nestjs/swagger';
import { ControlEntityUserResponseDto } from './dto/controlEntityUser-response.dto';
import { ControlEntityUserService } from './control-entity-user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ControlEntityUserDto } from './dto/control-entity-user.dto';
import { CreateControlEntityUserDto } from 'src/control-entity-user/dto/create-control-entity-user.dto';
import { CreateControlEntityUserResponseDto } from './dto/createControlEntityUser-response.dto';
import { ControlEntityUserQueryFilterDto } from './dto/control-entity-user-query-filter.dto';
import { FindControlEntityUserResponseDto } from './dto/find-control-entity-user-response.dto';

@ApiTags('controlEntityUser')
@ApiBearerAuth()
@Controller('controlEntityUser')
export class ControlEntityUserController {
    constructor(private readonly controlEntityUserService: ControlEntityUserService) { }

    @UseGuards(JwtAuthGuard)
    @Post('register')
    @ApiBody({ type: CreateControlEntityUserDto })
    @ApiOkResponse({
        description: 'Usuario asignado exitosamente a la entidad de control',
        type: CreateControlEntityUserResponseDto,
    })
    @ApiConflictResponse({ description: 'Usuario o entidad de control no encontrados' })
    async register(@Body() createControlEntityUserDto: CreateControlEntityUserDto) {
        const relation = await this.controlEntityUserService.assignUserToControlEntity(
            createControlEntityUserDto.userId,
            createControlEntityUserDto.controlEntityId,
        );

        if (!relation) {
            throw new HttpException(
                'Usuario o entidad de control no encontrados',
                HttpStatus.CONFLICT,
            );
        }

        return new CreateControlEntityUserResponseDto(
            HttpStatus.OK,
            'User assigned successfully',
            ControlEntityUserDto.fromEntity(relation),
        );
    }

    @ApiOkResponse({
        description: 'Availability Zones retrieved successfully',
        type: FindControlEntityUserResponseDto,
    })
    @Get()
    async find(@Query() findOptions: ControlEntityUserQueryFilterDto) {
        const zones = await this.controlEntityUserService.find(findOptions);
        return {
            statusCode: HttpStatus.OK,
            message: 'Availability Zones retrieved successfully',
            data: zones.data.map(ControlEntityUserDto.fromEntity),
            total: zones.total,
            limit: findOptions.limit ?? 0,
            offset: findOptions.offset ?? 0,
        };
    }
}

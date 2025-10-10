import {
    Controller,
    Post,
    UseGuards,
    Body,
    HttpException,
    HttpStatus,
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

@ApiTags('controlEntityUser')
@ApiBearerAuth()
@Controller('controlEntityUser')
export class ControlEntityUserController {
    constructor(private readonly controlEntityUserService: ControlEntityUserService) {}

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
}

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
// import { CreateControlEntityUserDto } from 'src/control-entity-user/dto/create-control-entity-user.dto';
import { CreateControlEntityUserResponseDto } from './dto/createControlEntityUser-response.dto';
import { ControlEntityUserQueryFilterDto } from './dto/control-entity-user-query-filter.dto';
import { FindControlEntityUserResponseDto } from './dto/find-control-entity-user-response.dto';

@ApiTags('controlEntityUser')
@ApiBearerAuth()
@Controller('controlEntityUser')
export class ControlEntityUserController {
    constructor(private readonly controlEntityUserService: ControlEntityUserService) { }
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

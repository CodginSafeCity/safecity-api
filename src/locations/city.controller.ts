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
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import {
    CreateCityResponseDto,
    FindCitiesResponseDto,
    FindCityByIdResponseDto,
    UpdateCityResponseDto,
    PatchCityResponseDto,
    DeleteCityResponseDto,
} from './dto/city-response.dto';
import { CityDto } from './dto/city.dto';
import { CityQueryFilterDto, CityFindOptionsDto } from './dto/city-find-options.dto';
import { CityService } from 'src/locations/city.service'

@ApiTags('city')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@ApiBadRequestResponse({ description: 'Bad request' })
@Controller('city')
export class CityController {
    private readonly logger = new Logger(CityController.name);

    constructor(private readonly cityService: CityService) { }

    @ApiOkResponse({
        description: 'City created successfully',
        type: CreateCityResponseDto,
    })
    @Post()
    async create(@Body() dto: CreateCityDto) {
        const zone = await this.cityService.create(dto);
        return {
            statusCode: HttpStatus.CREATED,
            message: 'City created successfully',
            data: CityDto.fromEntity(zone),
        };
    }

    @ApiOkResponse({
        description: 'Cities retrieved successfully with pagination',
        type: FindCitiesResponseDto,
    })
    @Get()
    async find(@Query() findOptions: CityFindOptionsDto) {
        const filter = CityQueryFilterDto.create(findOptions);
        const cities = await this.cityService.find(filter);

        return {
            statusCode: HttpStatus.OK,
            message: 'Cities retrieved successfully with pagination',
            data: cities.data.map(CityDto.fromEntity),
            total: cities.total,
            limit: findOptions.limit ?? 0,
            offset: findOptions.offset ?? 0,
        };
    }

    @ApiOkResponse({
        description: 'City retrieved successfully',
        type: FindCityByIdResponseDto,
    })
    @Get(':id')
    async findById(@Param('id', ParseUUIDPipe) id: string) {
        const zone = await this.cityService.findById(id);
        return {
            statusCode: HttpStatus.OK,
            message: 'City retrieved successfully',
            data: CityDto.fromEntity(zone),
        };
    }

    @ApiOkResponse({
        description: 'City updated successfully',
        type: UpdateCityResponseDto,
    })
    @Put(':id')
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCityDto) {
        const zone = await this.cityService.update(id, dto);
        return {
            statusCode: HttpStatus.OK,
            message: 'City updated successfully',
            data: CityDto.fromEntity(zone),
        };
    }

    @ApiOkResponse({
        description: 'City partially updated successfully',
        type: PatchCityResponseDto,
    })
    @Patch(':id')
    async patch(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCityDto) {
        const zone = await this.cityService.update(id, dto);
        return {
            statusCode: HttpStatus.OK,
            message: 'City partially updated successfully',
            data: CityDto.fromEntity(zone),
        };
    }

    @ApiOkResponse({
        description: 'City deleted successfully',
        type: DeleteCityResponseDto,
    })
    @Delete(':id')
    async delete(@Param('id', ParseUUIDPipe) id: string) {
        const zone = await this.cityService.delete(id);
        return {
            statusCode: HttpStatus.OK,
            message: 'City deleted successfully',
            data: CityDto.fromEntity(zone),
        };
    }
}
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsObject, ValidateNested } from 'class-validator';
import { LocationDto } from 'src/incidents/dto/location.dto';
import { Type } from 'class-transformer';

export class CreateCityDto {
    @ApiProperty({
        description: 'Nombre de la ciudad',
        example: 'Santiago de Cali',
    })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({
        description: 'ID de la región o provincia a la que pertenece la zona',
        example: '09379608-dfeb-406c-9945-63a8f83199fe',
    })
    @IsUUID()
    provinceId!: string;

    @ApiProperty({
        description: 'Ubicación en formato GeoJSON (Point)',
        type: () => LocationDto,
        required: true,
    })
    @ValidateNested()
    @Type(() => LocationDto)
    location!: LocationDto;
}
import { IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { LocationDto } from './location.dto';

export class CreateIncidentDto {
  @ApiProperty({ description: 'Usuario que reporta el incidente', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @ApiProperty({ description: 'Categoría del incidente', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  categoryId!: string;

  @ApiProperty({ description: 'Ciudad donde ocurre el incidente', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  cityId!: string;

  @ApiProperty({ description: 'Descripción del incidente' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({
    description: 'Fecha y hora en que se reporta el incidente',
    type: 'string',
    format: 'date-time',
  })
  @IsNotEmpty()
  reported_at!: Date;

  @ApiProperty({
    description: 'Fecha y hora de verificación (si aplica)',
    type: 'string',
    format: 'date-time',
    required: false,
  })
  @IsOptional()
  verified_at?: Date;

  @ApiProperty({
    description: 'Ubicación en formato GeoJSON (Point)',
    type: () => LocationDto,
    required: true,
  })
  @ValidateNested()
  @Type(() => LocationDto)
  location!: LocationDto;
}

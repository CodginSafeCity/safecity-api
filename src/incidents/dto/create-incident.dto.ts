import { IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { LocationDto } from './location.dto';
import { IncidentStatus } from '../incident.types';

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

  @ApiPropertyOptional({
    description: 'Fecha y hora de verificación (si aplica)',
    type: 'string',
    format: 'date-time',
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

  @ApiPropertyOptional({ enum: IncidentStatus, description: 'Estado del incidente' })
  @IsOptional()
  @IsEnum(IncidentStatus)
  status?: IncidentStatus;
}

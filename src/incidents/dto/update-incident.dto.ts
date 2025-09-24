import { IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { LocationDto } from './location.dto';

export class UpdateIncidentDto {
  @ApiPropertyOptional({ description: 'Usuario que reporta el incidente', format: 'uuid' })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({ description: 'Categoría del incidente', format: 'uuid' })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'Ciudad donde ocurre el incidente', format: 'uuid' })
  @IsUUID()
  @IsOptional()
  cityId?: string;

  @ApiPropertyOptional({ description: 'Descripción del incidente' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Fecha y hora en que se reporta el incidente',
    type: 'string',
    format: 'date-time',
  })
  @IsOptional()
  reported_at?: Date;

  @ApiPropertyOptional({
    description: 'Fecha y hora de verificación',
    type: 'string',
    format: 'date-time',
  })
  @IsOptional()
  verified_at?: Date;

  @ApiPropertyOptional({
    description: 'Ubicación en formato GeoJSON (Point)',
    type: () => LocationDto,
  })
  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  location?: LocationDto;
}

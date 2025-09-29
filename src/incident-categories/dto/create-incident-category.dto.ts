import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateIncidentCategoryDto {
  @ApiProperty({
    example: 'Accidente de tráfico',
    description: 'Nombre de la categoría de incidente',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'Incidentes relacionados con choques y accidentes viales',
    description: 'Descripción de la categoría de incidente',
  })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiPropertyOptional({
    example: '🚗',
    description: 'Ícono representativo de la categoría (opcional)',
  })
  @IsOptional()
  @IsString()
  icon?: string;
}

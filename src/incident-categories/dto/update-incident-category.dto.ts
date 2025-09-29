import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IncidentCategoryEntity } from '../incident-category.entity';

export class UpdateIncidentCategoryDto {
  @ApiPropertyOptional({
    example: 'Hurto Agravado',
    description: 'Nuevo nombre de la categoría de incidente',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: 'Categoría para reportar hurtos en zonas boscosas',
    description: 'Nueva descripción de la categoría de incidente',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: '🔥',
    description: 'Ícono representativo de la categoría',
  })
  @IsString()
  @IsOptional()
  icon?: string;

  static toEntity(
    dto: UpdateIncidentCategoryDto,
    entity: IncidentCategoryEntity,
  ): IncidentCategoryEntity {
    if (dto.name) entity.name = dto.name;
    if (dto.description) entity.description = dto.description;
    if (dto.icon) entity.icon = dto.icon;
    return entity;
  }
}

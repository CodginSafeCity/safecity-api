import { IsOptional, IsString } from 'class-validator';
import { IncidentCategoryEntity } from '../incident-category.entity';

export class UpdateIncidentCategoryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

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

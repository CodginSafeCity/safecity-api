import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { GenericQueryFilterDto } from 'src/core/dto/generic-query-filter.dto';
import { ListQueryDto } from 'src/core/dto/list-query.dto';
import { IncidentStatus } from '../incident.types';

export class IncidentFindOptionsDto extends ListQueryDto {
  @ApiPropertyOptional()
  @Expose()
  description?: string;

  @ApiPropertyOptional({ enum: IncidentStatus })
  @Expose()
  @IsOptional()
  @IsEnum(IncidentStatus)
  status?: IncidentStatus;
}

export class IncidentFilter extends OmitType(IncidentFindOptionsDto, [
  'limit',
  'offset',
]) {}

export class IncidentQueryFilterDto extends GenericQueryFilterDto<IncidentFilter> {
  static create(findOptions?: IncidentFindOptionsDto): IncidentQueryFilterDto {
    const filter = plainToInstance(IncidentFilter, findOptions, {
      excludeExtraneousValues: true,
      exposeUnsetFields: false,
    });

    const dto = new IncidentQueryFilterDto();
    dto.filter = filter;
    dto.pagination = {
      limit: findOptions?.limit,
      offset: findOptions?.offset,
    };
    return dto;
  }
}
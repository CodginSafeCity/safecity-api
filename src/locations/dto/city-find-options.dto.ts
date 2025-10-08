import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
import { ListQueryDto } from 'src/core/dto/list-query.dto';
import { GenericQueryFilterDto } from 'src/core/dto/generic-query-filter.dto';

export class CityFindOptionsDto extends ListQueryDto {
  @ApiPropertyOptional()
  @Expose()
  name?: string;
}

export class CityFilter extends OmitType(CityFindOptionsDto, [
  'limit',
  'offset',
]) {}


export class CityQueryFilterDto extends GenericQueryFilterDto<CityFilter> {
  static create(findOptions?: CityFindOptionsDto): CityQueryFilterDto {
    const filter = plainToInstance(CityFilter, findOptions, {
      excludeExtraneousValues: true,
      exposeUnsetFields: false,
    });

    const dto = new CityQueryFilterDto();
    dto.filter = filter;
    dto.pagination = {
      limit: findOptions?.limit,
      offset: findOptions?.offset,
    };
    return dto;
  }
}
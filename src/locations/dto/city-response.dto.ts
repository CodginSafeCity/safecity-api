import { ApiProperty } from '@nestjs/swagger';
import { CityDto } from './city.dto';

export class CreateCityResponseDto {
  @ApiProperty()
  statusCode!: number;

  @ApiProperty()
  message!: string;

  @ApiProperty({ type: CityDto })
  data!: CityDto;
}

export class FindCitiesResponseDto {
  @ApiProperty()
  statusCode!: number;

  @ApiProperty()
  message!: string;

  @ApiProperty({ type: [CityDto] })
  data!: CityDto[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  limit!: number;

  @ApiProperty()
  offset!: number;
}

export class FindCityByIdResponseDto {
  @ApiProperty()
  statusCode!: number;

  @ApiProperty()
  message!: string;

  @ApiProperty({ type: CityDto })
  data!: CityDto;
}

export class UpdateCityResponseDto extends FindCityByIdResponseDto {}
export class PatchCityResponseDto extends FindCityByIdResponseDto {}
export class DeleteCityResponseDto extends FindCityByIdResponseDto {}

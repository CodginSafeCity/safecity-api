import { ApiProperty } from '@nestjs/swagger';
import { CityEntity } from '../city.entity';
import { ProvinceEntity } from 'src/locations/province.entity';

export class CityInfoDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  static fromEntity(city: CityEntity): CityInfoDto {
    const dto = new CityInfoDto();
    dto.id = city.id;
    dto.name = city.name;
    return dto;
  }
}

export class ProvinceInfoDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  location!: any;

  static fromEntity(province: ProvinceEntity): ProvinceInfoDto {
    const dto = new ProvinceInfoDto();
    dto.id = province.id;
    dto.name = province.name;
    return dto;
  }
}

export class CityDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ type: () => ProvinceInfoDto })
  province!: ProvinceInfoDto;

  @ApiProperty({ required: false })
  location?: object;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  static fromEntity(entity: CityEntity): CityDto {
    const dto = new CityDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.province = ProvinceInfoDto.fromEntity(entity.province);
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }
}

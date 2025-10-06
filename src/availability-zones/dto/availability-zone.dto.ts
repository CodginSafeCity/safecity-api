import { ApiProperty } from '@nestjs/swagger';
import { AvailabilityZoneEntity } from '../availability-zone.entity';
import { CityEntity } from 'src/locations/city.entity';
import { ControlEntity } from 'src/control-entities/control-entity.entity';

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

export class ControlEntityInfoDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  static fromEntity(control: ControlEntity): ControlEntityInfoDto {
    const dto = new ControlEntityInfoDto();
    dto.id = control.id;
    dto.name = control.name;
    return dto;
  }
}

export class AvailabilityZoneDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ type: () => CityInfoDto })
  city!: CityInfoDto;

  @ApiProperty({ type: () => ControlEntityInfoDto })
  controlEntity!: ControlEntityInfoDto;

  @ApiProperty({ required: false })
  area?: object;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  static fromEntity(entity: AvailabilityZoneEntity): AvailabilityZoneDto {
    const dto = new AvailabilityZoneDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.city = CityInfoDto.fromEntity(entity.city);
    dto.controlEntity = ControlEntityInfoDto.fromEntity(entity.controlEntity);
    dto.area = entity.area;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }
}

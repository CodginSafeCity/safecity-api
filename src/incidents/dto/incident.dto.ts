import { ApiProperty } from '@nestjs/swagger';
import { IncidentEntity } from '../incident.entity';
import { IncidentStatus } from '../incident.types';

export class UserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  email: string;
}

export class CategoryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

export class CityDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

export class IncidentDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  reported_at: Date;

  @ApiProperty({ required: false, nullable: true })
  verified_at?: Date;

  @ApiProperty({ required: false, nullable: true })
  location?: any;

  @ApiProperty({ enum: IncidentStatus })
  status: IncidentStatus;

  @ApiProperty({ type: UserDto, required: false })
  user?: UserDto;

  @ApiProperty({ type: CategoryDto, required: false })
  category?: CategoryDto;

  @ApiProperty({ type: CityDto, required: false })
  city?: CityDto;

  static fromEntity(entity: IncidentEntity): IncidentDto {
    const dto = new IncidentDto();
    dto.id = entity.id;
    dto.description = entity.description;
    dto.reported_at = entity.reported_at;
    dto.verified_at = entity.verified_at;
    dto.location = entity.location;
    dto.status = entity.status;

    dto.user = entity.user ? {
      id: entity.user.id,
      name: entity.user.name,
      last_name: entity.user.last_name,
      email: entity.user.email,
    } : undefined;

    dto.category = entity.category ? {
      id: entity.category.id,
      name: entity.category.name,
    } : undefined;

    dto.city = entity.city ? {
      id: entity.city.id,
      name: entity.city.name,
    } : undefined;

    return dto;
  }
}

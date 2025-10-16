import { ApiProperty } from '@nestjs/swagger';
import { IncidentEntity } from '../incident.entity';
import { IncidentStatus } from '../incident.types';
import wkx from 'wkx';

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

export class AvailabilityZoneDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false, nullable: true })
  area?: any;
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

  @ApiProperty({ type: [AvailabilityZoneDto], required: false })
  availabilityZones?: AvailabilityZoneDto[];

  static fromEntity(entity: IncidentEntity): IncidentDto {
    const dto = new IncidentDto();
    dto.id = entity.id;
    dto.description = entity.description;
    dto.reported_at = entity.reported_at;
    dto.verified_at = entity.verified_at;

    if (entity.location) {
      try {
        const geom = wkx.Geometry.parse(Buffer.from(entity.location, 'hex')) as any;
        if (geom && geom.x !== undefined && geom.y !== undefined) {
          dto.location = {
            lat: geom.y,
            lng: geom.x,
          };
        } else {
          dto.location = geom.toGeoJSON();
        }
      } catch (e) {
        dto.location = null;
      }
    } else {
      dto.location = null;
    }

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

    if ((entity as any).controlEntity?.availabilityZones) {
      dto.availabilityZones = (entity as any).controlEntity.availabilityZones.map((zone: any) => {
        let parsedArea: any = null;

        if (zone.area) {
          try {
            const geom = wkx.Geometry.parse(Buffer.from(zone.area, 'hex'));
            parsedArea = geom.toGeoJSON();
          } catch (e) {
            parsedArea = null;
          }
        }

        return {
          id: zone.id,
          name: zone.name,
          area: parsedArea,
        };
      });
    }

    return dto;
  }
}

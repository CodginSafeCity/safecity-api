import { ApiProperty } from '@nestjs/swagger';
import { IncidentEntity } from '../incident.entity';

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

  @ApiProperty({ type: String })
  userId: string;

  @ApiProperty({ type: String })
  categoryId: string;

  @ApiProperty({ type: String })
  cityId: string;

  static fromEntity(entity: IncidentEntity): IncidentDto {
    const dto = new IncidentDto();
    dto.id = entity.id;
    dto.description = entity.description;
    dto.reported_at = entity.reported_at;
    dto.verified_at = entity.verified_at;
    dto.location = entity.location;

    dto.userId = entity.user?.id;
    dto.categoryId = entity.category?.id;
    dto.cityId = entity.city?.id;

    return dto;
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { ControlEntityUser } from '../control-entity-user.entity';

export class ControlEntityUserDto {
  @ApiProperty({ description: 'UUID del registro de relación', example: 'a3d2f080-d124-4e4e-a24f-60f5340f9b27' })
  id: string;

  @ApiProperty({ description: 'ID del usuario relacionado' })
  userId: string;

  @ApiProperty({ description: 'ID de la entidad de control relacionada' })
  controlEntityId: string;

  @ApiProperty({ description: 'Fecha de creación del registro', example: '2025-10-10T14:22:35.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización', example: '2025-10-10T14:22:35.000Z' })
  updatedAt: Date;

  static fromEntity(entity: ControlEntityUser): ControlEntityUserDto {
    const dto = new ControlEntityUserDto();
    dto.id = entity.id;
    dto.userId = entity.userId.id;
    dto.controlEntityId = entity.controlEntity.id;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }
}

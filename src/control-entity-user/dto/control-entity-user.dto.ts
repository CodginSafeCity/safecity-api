import { ApiProperty } from '@nestjs/swagger';
import { ControlEntityUser } from '../control-entity-user.entity';
import { UserEntity } from 'src/user/user.entity';
import { ControlEntity } from 'src/control-entities/control-entity.entity';

export class ControlEntityUserDto {
  @ApiProperty({ description: 'UUID del registro de relación' })
  id: string;

  @ApiProperty({ description: 'Usuario relacionado', type: () => UserEntity })
  user: any;

  @ApiProperty({ description: 'Entidad de control relacionada', type: () => ControlEntity })
  controlEntity: any;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  updatedAt: Date;

  static fromEntity(entity: ControlEntityUser): ControlEntityUserDto {
    const dto = new ControlEntityUserDto();
    dto.id = entity.id;
    dto.user = entity.user ? {
      id: entity.user.id,
      email: entity.user.email,
      name: entity.user.name,
    } : null;

    dto.controlEntity = entity.controlEntity ? {
      id: entity.controlEntity.id,
      name: entity.controlEntity.name,
    } : null;

    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }
}

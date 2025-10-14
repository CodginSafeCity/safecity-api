import { ApiProperty } from '@nestjs/swagger';
import { ControlEntity } from '../control-entity.entity';

export class ControlEntityResponseDto {
  @ApiProperty({
    example: 'd1f7a6b2-1234-4a67-9c8e-0fabc1234567',
    description: 'Identificador único de la entidad de control',
  })
  id: string;

  @ApiProperty({
    example: 'Estación Norte',
    description: 'Nombre de la entidad de control',
  })
  name: string;

  @ApiProperty({
    example: 'Calle 123 #45-67, Bogotá',
    description: 'Dirección física de la entidad de control',
  })
  address: string;

  @ApiProperty({
    example: '+57 310 4567890',
    description: 'Número de contacto de la entidad de control',
  })
  phone: string;

  static fromEntity(entity: ControlEntity): ControlEntityResponseDto {
    const dto = new ControlEntityResponseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.address = entity.address;
    dto.phone = entity.phone;
    return dto;
  }
}


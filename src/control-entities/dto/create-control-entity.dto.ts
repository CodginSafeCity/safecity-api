import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateControlEntityDto {
  @ApiProperty({
    example: 'Alcaldía de Bogotá',
    description: 'Nombre de la entidad de control',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Calle 26 # 15-32, Bogotá',
    description: 'Dirección de la entidad de control',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    example: '+57 320 123 4567',
    description: 'Número telefónico de la entidad de control',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;
}

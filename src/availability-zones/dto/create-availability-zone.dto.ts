import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsObject } from 'class-validator';

export class CreateAvailabilityZoneDto {
  @ApiProperty({
    description: 'Nombre de la zona',
    example: 'Zona Norte',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'ID de la entidad de control asociada',
    example: '2223c4b9-797c-40e4-aede-b10d1dcec648',
  })
  @IsUUID()
  controlEntityId!: string;

  @ApiProperty({
    description: 'ID de la ciudad a la que pertenece la zona',
    example: '09379608-dfeb-406c-9945-63a8f83199fe',
  })
  @IsUUID()
  cityId!: string;

  @ApiProperty({
    description: 'Área geoespacial en formato GeoJSON (Polygon o MultiPolygon)',
    example: {
      type: 'Polygon',
      coordinates: [
        [
          [-74.08175, 4.60971],
          [-74.08200, 4.60971],
          [-74.08200, 4.61000],
          [-74.08175, 4.61000],
          [-74.08175, 4.60971]
        ]
      ]
    },
  })
  @IsObject()
  @IsNotEmpty()
  area!: object;
}
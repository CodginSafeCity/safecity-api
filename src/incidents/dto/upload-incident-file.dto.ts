import { ApiProperty } from '@nestjs/swagger';

export class UploadIncidentFileDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Archivo de evidencia a subir',
  })
  file: any;
}
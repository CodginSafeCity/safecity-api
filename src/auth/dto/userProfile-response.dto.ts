import { ApiProperty } from '@nestjs/swagger';

class RoleDto {
  @ApiProperty({ example: '56ae8c7b-fbb2-4721-a19f-5b4a33eb980b', format: 'uuid' })
  id: string;

  @ApiProperty({ example: '2025-09-12T23:33:18.498Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-09-12T23:33:18.498Z' })
  updatedAt: string;

  @ApiProperty({ example: 'citizen' })
  name: string;

  @ApiProperty({ example: 'Ciudadano' })
  description: string;
}

class CityDto {
  @ApiProperty({ example: '1441e47c-d863-4da4-9c7a-2e0ce4026811', format: 'uuid' })
  id: string;

  @ApiProperty({ example: '2025-10-01T02:29:44.575Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-10-01T02:29:44.575Z' })
  updatedAt: string;

  @ApiProperty({ example: 'Cali' })
  name: string;

  @ApiProperty({ example: 'cf111a42-38d4-4fcb-aab5-d27446cfde22', format: 'uuid' })
  province: string;

  @ApiProperty({ example: null, nullable: true })
  location: string | null;
}

export class UserProfileResponseDto {
  @ApiProperty({ example: '599f3ee3-fe5c-486a-9f07-a77259a2ea8f', format: 'uuid' })
  id: string;

  @ApiProperty({ example: '2025-10-01T20:38:33.616Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-10-01T20:38:33.616Z' })
  updatedAt: string;

  @ApiProperty({ example: 'Adalberto' })
  name: string;

  @ApiProperty({ example: 'Manyoma' })
  last_name: string;

  @ApiProperty({ example: 'jimmy@hotmail.com' })
  email: string;

  @ApiProperty({
    example: '$2b$10$dNP/Gr4dhRN0Yc/92UT3Y.sFSLHPmKr8ANiQmSMZ61KSQZkXNEohG',
    description: 'Hash de la contraseña'
  })
  password: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg' })
  avatar: string;

  @ApiProperty({ type: () => RoleDto })
  role: RoleDto;

  @ApiProperty({ type: () => CityDto })
  city: CityDto;
}

import { ApiProperty } from '@nestjs/swagger';

// DTO base de la entidad
export class IncidentCategoryDto {
  @ApiProperty({ example: 'e502f40e-17d9-4784-9625-5a1c7edfa0c7' })
  id: string;

  @ApiProperty({ example: '2025-09-23T16:28:44.407Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-09-23T16:28:44.408Z' })
  updatedAt: string;

  @ApiProperty({ example: 'Robo' })
  name: string;

  @ApiProperty({ example: 'Incidentes relacionados con robo, hurto o asalto' })
  description: string;

  @ApiProperty({ example: 'https://example.com/icons/robbery.png' })
  icon: string;
}

// CREATE
export class CreateIncidentCategoryResponseDto {
  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: 'Incident category created successfully' })
  message: string;

  @ApiProperty({ type: IncidentCategoryDto })
  data: IncidentCategoryDto;
}

// GET ALL
export class FindIncidentCategoriesResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Incident categories retrieved successfully' })
  message: string;

  @ApiProperty({ type: [IncidentCategoryDto] })
  data: IncidentCategoryDto[];
}

// GET BY ID
export class FindIncidentCategoryResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Incident category retrieved successfully' })
  message: string;

  @ApiProperty({ type: IncidentCategoryDto })
  data: IncidentCategoryDto;
}

// UPDATE
export class UpdateIncidentCategoryResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Incident category updated successfully' })
  message: string;

  @ApiProperty({ type: IncidentCategoryDto })
  data: IncidentCategoryDto;
}

// DELETE
export class DeleteIncidentCategoryResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Incident category deleted successfully' })
  message: string;

  @ApiProperty({ type: IncidentCategoryDto })
  data: IncidentCategoryDto;
}

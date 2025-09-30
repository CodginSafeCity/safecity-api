import { ApiProperty } from '@nestjs/swagger';
import { IncidentDto } from './incident.dto';

export class CreateIncidentResponseDto {
  @ApiProperty({ example: 201 })
  statusCode: number;

  @ApiProperty({ example: 'Incident created successfully' })
  message: string;

  @ApiProperty({ type: IncidentDto })
  data: IncidentDto;
}

export class FindIncidentsResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Incidents retrieved successfully with pagination' })
  message: string;

  @ApiProperty({ type: [IncidentDto] })
  data: IncidentDto[];

  @ApiProperty({ example: 42 })
  total: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 0 })
  offset: number;
}

export class FindIncidentByIdResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Incident retrieved successfully' })
  message: string;

  @ApiProperty({ type: IncidentDto })
  data: IncidentDto;
}

export class UpdateIncidentResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Incident updated successfully' })
  message: string;

  @ApiProperty({ type: IncidentDto })
  data: IncidentDto;
}

export class PatchIncidentResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Incident partially updated successfully' })
  message: string;

  @ApiProperty({ type: IncidentDto })
  data: IncidentDto;
}

export class DeleteIncidentResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Incident deleted successfully' })
  message: string;

  @ApiProperty({ type: IncidentDto })
  data: IncidentDto;
}

export class FindIncidentsByUserResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Incidents by user retrieved successfully' })
  message: string;

  @ApiProperty({ type: [IncidentDto] })
  data: IncidentDto[];
}

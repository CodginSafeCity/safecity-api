import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { CommonResponse } from 'src/core/api-response.model';
import { IncidentDto } from './incident.dto';

export class ListIncidentsResponseDto extends CommonResponse<IncidentDto[]> {
  @ApiProperty({ type: [IncidentDto] })
  declare data: IncidentDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;

  constructor(
    statusCode: HttpStatus,
    message: string,
    data: IncidentDto[],
    total: number,
    limit: number,
    offset: number,
  ) {
    super(statusCode, message, data);
    this.total = total;
    this.limit = limit;
    this.offset = offset;
  }
}

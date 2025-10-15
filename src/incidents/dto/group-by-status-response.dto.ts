import { ApiProperty } from '@nestjs/swagger';

export class IncidentGroupByStatusItemDto {
  @ApiProperty({
    example: 'OPEN',
    description: 'Estado del incidente',
  })
  status!: string;

  @ApiProperty({
    example: 42,
    description: 'Número total de incidentes con este estado',
  })
  total!: number;
}

export class GroupByStatusResponseDto {
  @ApiProperty({ example: 200 })
  statusCode!: number;

  @ApiProperty({ example: 'Incidents grouped by status' })
  message!: string;

  @ApiProperty({
    type: [IncidentGroupByStatusItemDto],
    example: [
      { status: 'OPEN', total: 25 },
      { status: 'IN_PROGRESS', total: 10 },
      { status: 'CLOSED', total: 7 },
    ],
  })
  data!: IncidentGroupByStatusItemDto[];
}

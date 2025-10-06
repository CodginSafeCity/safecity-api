import { ApiProperty } from '@nestjs/swagger';
import { AvailabilityZoneDto } from './availability-zone.dto';

export class CreateAvailabilityZoneResponseDto {
  @ApiProperty()
  statusCode!: number;

  @ApiProperty()
  message!: string;

  @ApiProperty({ type: AvailabilityZoneDto })
  data!: AvailabilityZoneDto;
}

export class FindAvailabilityZonesResponseDto {
  @ApiProperty()
  statusCode!: number;

  @ApiProperty()
  message!: string;

  @ApiProperty({ type: [AvailabilityZoneDto] })
  data!: AvailabilityZoneDto[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  limit!: number;

  @ApiProperty()
  offset!: number;
}

export class FindAvailabilityZoneByIdResponseDto {
  @ApiProperty()
  statusCode!: number;

  @ApiProperty()
  message!: string;

  @ApiProperty({ type: AvailabilityZoneDto })
  data!: AvailabilityZoneDto;
}

export class UpdateAvailabilityZoneResponseDto extends FindAvailabilityZoneByIdResponseDto {}
export class PatchAvailabilityZoneResponseDto extends FindAvailabilityZoneByIdResponseDto {}
export class DeleteAvailabilityZoneResponseDto extends FindAvailabilityZoneByIdResponseDto {}

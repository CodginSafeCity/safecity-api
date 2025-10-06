import { PartialType } from '@nestjs/swagger';
import { CreateAvailabilityZoneDto } from './create-availability-zone.dto';

export class UpdateAvailabilityZoneDto extends PartialType(CreateAvailabilityZoneDto) {}

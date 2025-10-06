import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AvailabilityZonesService } from './availability-zones.service';
import { AvailabilityZonesController } from 'src/availability-zones/availability-zone.controller';
import { AvailabilityZoneEntity } from './availability-zone.entity';
import { CityEntity } from 'src/locations/city.entity';
import { ControlEntity } from 'src/control-entities/control-entity.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      AvailabilityZoneEntity,
      CityEntity,
      ControlEntity,
    ]),
  ],
  controllers: [AvailabilityZonesController],
  providers: [AvailabilityZonesService],
  exports: [AvailabilityZonesService],
})
export class AvailabilityZonesModule {}
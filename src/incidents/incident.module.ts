import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { IncidentEntity } from './incident.entity';
import { IncidentService } from './incident.service';
import { IncidentController } from './incident.controller';
import { UserEntity } from 'src/user/user.entity';
import { IncidentCategoryEntity } from 'src/incident-categories/incident-category.entity';
import { AvailabilityZoneEntity } from 'src/availability-zones/availability-zone.entity';
import { ControlEntity } from 'src/control-entities/control-entity.entity';
import { ControlEntityUser } from 'src/control-entity-user/control-entity-user.entity';
import { CityEntity } from 'src/locations/city.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      IncidentEntity,
      UserEntity,
      IncidentCategoryEntity,
      CityEntity,
      AvailabilityZoneEntity,
      ControlEntity,
      ControlEntityUser
    ]),
  ],
  controllers: [IncidentController],
  providers: [IncidentService],
  exports: [IncidentService],
})
export class IncidentModule {}

import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ControlEntityController } from 'src/control-entities/control-entities.controller';
import { ControlEntityService } from 'src/control-entities/control-entities.service';
import { CityEntity } from 'src/locations/city.entity';
import { ControlEntity } from 'src/control-entities/control-entity.entity';
import { ControlEntityUser } from 'src/control-entity-user/control-entity-user.entity';
import { AvailabilityZoneEntity } from 'src/availability-zones/availability-zone.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      AvailabilityZoneEntity,
      CityEntity,
      ControlEntity,
      ControlEntityUser
    ]),
  ],
  controllers: [ControlEntityController],
  providers: [ControlEntityService],
  exports: [ControlEntityService],
})
export class ControlEntityModule {}
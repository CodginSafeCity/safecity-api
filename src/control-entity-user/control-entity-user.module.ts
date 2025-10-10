import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ControlEntityUserController } from 'src/control-entity-user/control-entity-user.controller';
import { ControlEntityUserService } from 'src/control-entity-user/control-entity-user.service';
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
  controllers: [ControlEntityUserController],
  providers: [ControlEntityUserService],
  exports: [ControlEntityUserService],
})
export class ControlEntityUserModule {}
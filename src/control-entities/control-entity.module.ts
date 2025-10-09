import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ControlEntityController } from 'src/control-entities/control-entities.controller';
import { ControlEntityService } from 'src/control-entities/control-entities.service';
import { CityEntity } from 'src/locations/city.entity';
import { ControlEntity } from 'src/control-entities/control-entity.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      ControlEntityService,
      CityEntity,
      ControlEntity,
    ]),
  ],
  controllers: [ControlEntityController],
  providers: [ControlEntityService],
  exports: [ControlEntityService],
})
export class ControllEntityModule {}
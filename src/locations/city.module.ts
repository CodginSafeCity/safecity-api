import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CityEntity } from './city.entity';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { ProvinceEntity } from 'src/locations/province.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      ProvinceEntity,
      CityEntity,
    ]),
  ],
  controllers: [CityController],
  providers: [CityService],
  exports: [CityService],
})
export class CityModule {}

import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from 'src/core/base-entity';
import { CityEntity } from 'src/locations/city.entity';
import { ControlEntity } from 'src/control-entities/control-entity.entity';

@Entity({ tableName: 'availability_zones' })
export class AvailabilityZoneEntity extends BaseEntity {

  @ManyToOne(() => ControlEntity)
  controlEntity!: ControlEntity;

  @ManyToOne(() => CityEntity)
  city!: CityEntity;

  @Property({ columnType: 'geometry(Polygon, 4326)', nullable: true })
  area?: object;
}
import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from 'src/core/base-entity';
import { CityEntity } from 'src/locations/city.entity';
import { ControlEntity } from 'src/control-entities/control-entity.entity';

@Entity({ tableName: 'availability_zones' })
export class AvailabilityZoneEntity extends BaseEntity {
  @Property()
  name: string;

  @ManyToOne(() => CityEntity)
  city: CityEntity;

  @ManyToOne(() => ControlEntity)
  controlEntity: ControlEntity;

  @Property({ type: 'geometry', nullable: false })
  area: object;

  constructor(
    name: string,
    city: CityEntity,
    controlEntity: ControlEntity,
    area: object,
  ) {
    super();
    this.name = name;
    this.city = city;
    this.controlEntity = controlEntity;
    this.area = area;
  }
}

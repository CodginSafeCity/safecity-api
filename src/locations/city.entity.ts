import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { ProvinceEntity } from 'src/locations/province.entity';
import { BaseEntity } from 'src/core/base-entity';

@Entity({ tableName: 'cities' })
export class CityEntity extends BaseEntity {
  @Property()
  name!: string;

  @ManyToOne(() => ProvinceEntity)
  province!: ProvinceEntity;

  @Property({ type: 'geometry', nullable: true })
  location?: any;

  constructor(
    name: string,
    province: ProvinceEntity,
    location: any,
  ) {
    super();
    this.name = name;
    this.province = province;
    this.location = location;
  }
}
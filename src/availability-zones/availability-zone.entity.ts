import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { UserEntity } from 'src/user/user.entity';
import { CityEntity } from 'src/locations/city.entity';
import { BaseEntity } from 'src/core/base-entity';

@Entity({ tableName: 'availability_zones' })
export class AvailabilityZoneEntity extends BaseEntity {
  @ManyToOne(() => UserEntity)
  user!: UserEntity;

  @ManyToOne(() => CityEntity)
  city!: CityEntity;

  @Property({ type: 'geometry', nullable: true })
  location?: any;
}

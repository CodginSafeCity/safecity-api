import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { UserEntity } from 'src/user/user.entity';
import { IncidentCategoryEntity } from './incident-category.entity';
import { CityEntity } from 'src/locations/city.entity';
import { BaseEntity } from 'src/core/base-entity';

@Entity({ tableName: 'incidents' })
export class IncidentEntity extends BaseEntity {
  @ManyToOne(() => UserEntity)
  user!: UserEntity;

  @ManyToOne(() => IncidentCategoryEntity)
  category!: IncidentCategoryEntity;

  @ManyToOne(() => CityEntity)
  city!: CityEntity;

  @Property()
  description!: string;

  @Property({ type: 'timestamp' })
  reported_at!: Date;

  @Property({ type: 'timestamp', nullable: true })
  verified_at?: Date;

  @Property({ type: 'geometry', nullable: true })
  location?: any;
}

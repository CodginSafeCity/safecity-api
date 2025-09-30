import { Entity, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { UserEntity } from 'src/user/user.entity';
import { IncidentCategoryEntity } from 'src/incident-categories/incident-category.entity';
import { CityEntity } from 'src/locations/city.entity';
import { BaseEntity } from 'src/core/base-entity';
import { IncidentStatus } from './incident.types';

@Entity({ tableName: 'incidents' })
export class IncidentEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, { eager: true })
  user!: UserEntity;

  @ManyToOne(() => IncidentCategoryEntity, { eager: true })
  category!: IncidentCategoryEntity;

  @ManyToOne(() => CityEntity, { eager: true })
  city!: CityEntity;

  @Property()
  description!: string;

  @Property({ type: 'timestamp' })
  reported_at!: Date;

  @Property({ type: 'timestamp', nullable: true })
  verified_at?: Date;

  @Property({ type: 'geometry', nullable: true })
  location?: any;

  @Enum(() => IncidentStatus)
  status: IncidentStatus = IncidentStatus.OPEN;

}

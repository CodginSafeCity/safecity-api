// incident.entity.ts
import { Entity, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { UserEntity } from 'src/user/user.entity';
import { IncidentCategoryEntity } from 'src/incident-categories/incident-category.entity';
import { CityEntity } from 'src/locations/city.entity';
import { BaseEntity } from 'src/core/base-entity';
import { IncidentStatus } from './incident.types';

@Entity({ tableName: 'incidents' })
export class IncidentEntity extends BaseEntity {
  @Property({ nullable: true })
  title?: string;

  @Property()
  description!: string;

  @ManyToOne(() => IncidentCategoryEntity, { eager: true, nullable: true })
  category?: IncidentCategoryEntity;

  @Enum(() => IncidentStatus)
  status: IncidentStatus = IncidentStatus.OPEN;

  @Property({ nullable: true })
  cluster_group?: number;

  @ManyToOne(() => UserEntity, { eager: true, nullable: true })
  reported_by?: UserEntity;

  get user(): UserEntity | undefined {
    return this.reported_by;
  }
  set user(value: UserEntity | undefined) {
    this.reported_by = value;
  }

  @ManyToOne(() => UserEntity, { eager: true, nullable: true })
  assigned_to?: UserEntity;

  @ManyToOne(() => CityEntity, { eager: true, nullable: true })
  city?: CityEntity;

  @Property({ type: 'geometry', nullable: true })
  location?: any;

  @Property({ type: 'timestamp' })
  reported_at!: Date;

  @Property({ type: 'timestamp', nullable: true })
  assigned_at?: Date;

  @Property({ type: 'timestamp', nullable: true })
  verified_at?: Date;
}
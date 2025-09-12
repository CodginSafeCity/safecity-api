import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { IncidentEntity } from './incident.entity';
import { BaseEntity } from 'src/core/base-entity';

@Entity({ tableName: 'incident_pictures' })
export class IncidentPicture extends BaseEntity {
  @ManyToOne(() => IncidentEntity)
  incident!: IncidentEntity;

  @Property()
  url!: string;
}

import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from 'src/core/base-entity';

@Entity({ tableName: 'incident_categories' })
export class IncidentCategoryEntity extends BaseEntity {
  @Property()
  name!: string;

  @Property()
  description!: string;

  @Property({ nullable: true })
  icon?: string;
}
